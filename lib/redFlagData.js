// I AM THE RED FLAG — Game Data
// All stories, archetypes, levels, and progression data

export const ARCHETYPES = [
  {
    id: "red-flag-energy",
    name: "Red Flag Energy",
    nameFr: "Énergie Red Flag",
    emoji: "🚩",
    tagline: "I am the problem.",
    description: "Tu assumes tout. Tu doutes de rien.",
    bonus: "×1.5 sur tous les scores",
    color: "#E85C3A",
    glow: "rgba(232,92,58,0.4)",
    multipliers: { chaos: 1.5, manipulation: 1.5, heartbreak: 1.5, rf: 1.5 },
  },
  {
    id: "emotionally-expensive",
    name: "Emotionally Expensive",
    nameFr: "Émotionnellement Coûteux",
    emoji: "💸",
    tagline: "Tu coûtes trop cher émotionnellement.",
    description: "Les autres paient le prix de ta présence.",
    bonus: "×2 sur Heartbreak",
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.4)",
    multipliers: { chaos: 1.0, manipulation: 1.2, heartbreak: 2.0, rf: 1.3 },
  },
  {
    id: "delusional",
    name: "Delusional",
    nameFr: "Délusionnel",
    emoji: "🤡",
    tagline: "Reality is overrated.",
    description: "Tu vis dans ta propre version des faits.",
    bonus: "×2 sur Chaos",
    color: "#ec4899",
    glow: "rgba(236,72,153,0.4)",
    multipliers: { chaos: 2.0, manipulation: 0.8, heartbreak: 1.2, rf: 1.4 },
  },
  {
    id: "heartbreaker",
    name: "Heartbreaker",
    nameFr: "Briseur de Cœurs",
    emoji: "💔",
    tagline: "Not sorry.",
    description: "Tu brises les cœurs sans effort ni regret.",
    bonus: "×3 sur Heartbreak",
    color: "#f43f5e",
    glow: "rgba(244,63,94,0.4)",
    multipliers: { chaos: 1.0, manipulation: 1.0, heartbreak: 3.0, rf: 1.5 },
  },
  {
    id: "master-manipulator",
    name: "Master Manipulator",
    nameFr: "Maître Manipulateur",
    emoji: "🐍",
    tagline: "I never lie. I just reframe the truth.",
    description: "Tu retournes les situations à ton avantage.",
    bonus: "×2.5 sur Manipulation",
    color: "#22c55e",
    glow: "rgba(34,197,94,0.4)",
    multipliers: { chaos: 0.8, manipulation: 2.5, heartbreak: 1.0, rf: 1.6 },
  },
  {
    id: "chaos-director",
    name: "Chaos Director",
    nameFr: "Directeur du Chaos",
    emoji: "🔥",
    tagline: "I didn't start the fire. Actually I did.",
    description: "Tu orchestres le chaos comme un art.",
    bonus: "×3 sur Chaos",
    color: "#f97316",
    glow: "rgba(249,115,22,0.4)",
    multipliers: { chaos: 3.0, manipulation: 1.0, heartbreak: 0.8, rf: 1.7 },
  },
  {
    id: "toxic-queen",
    name: "Toxic Queen",
    nameFr: "Reine Toxique",
    emoji: "👑",
    tagline: "Crown doesn't slip.",
    description: "Tu régnes sur chaque drama. Toujours.",
    bonus: "×2 sur tout + accès aux choix exclusifs",
    color: "#a855f7",
    glow: "rgba(168,85,247,0.4)",
    multipliers: { chaos: 2.0, manipulation: 2.0, heartbreak: 2.0, rf: 2.0 },
    exclusive: true,
  },
  {
    id: "main-character",
    name: "Main Character Syndrome",
    nameFr: "Syndrome du Personnage Principal",
    emoji: "✨",
    tagline: "Everyone else is a supporting role.",
    description: "Tu es le centre de l'univers. Littéralement.",
    bonus: "×2 sur RF Points pour les choix dramatiques",
    color: "#06b6d4",
    glow: "rgba(6,182,212,0.4)",
    multipliers: { chaos: 1.3, manipulation: 1.3, heartbreak: 1.3, rf: 2.0 },
  },
];

export const LEVELS = [
  { level: 1, title: "Innocent Crush", minRF: 0 },
  { level: 5, title: "Drama Starter", minRF: 1000 },
  { level: 10, title: "Red Flag", minRF: 3000 },
  { level: 20, title: "Master Manipulator", minRF: 8000 },
  { level: 30, title: "Heartbreaker", minRF: 18000 },
  { level: 40, title: "Chaos Director", minRF: 35000 },
  { level: 50, title: "Toxic Queen", minRF: 60000 },
  { level: 100, title: "Final Boss", minRF: 150000 },
];

export function getLevelTitle(rfPoints) {
  let current = LEVELS[0];
  for (const lvl of LEVELS) {
    if (rfPoints >= lvl.minRF) current = lvl;
    else break;
  }
  return current.title;
}

export function getShareQuote(title) {
  const quotes = {
    "Innocent Crush": "J'apprends vite.",
    "Drama Starter": "Je commence à peine.",
    "Red Flag": "Considère ça comme un avertissement.",
    "Master Manipulator": "Je ne mens pas. Je recadre la réalité.",
    "Heartbreaker": "Je ne m'excuse pas d'exister.",
    "Chaos Director": "Je n'ai pas commencé le drama. En fait si.",
    "Toxic Queen": "La couronne ne glisse pas.",
    "Final Boss": "Il n'y a pas de niveau suivant.",
  };
  return quotes[title] || "I never start drama. I improve it.";
}

// Diagnose archetype from accumulated stats (used in diagnostic mode — no pre-selection)
export function diagnoseArchetype(chaos, manipulation, heartbreak, rf) {
  const scores = {
    "chaos-director":        chaos * 3.0,
    "master-manipulator":    manipulation * 2.5,
    "heartbreaker":          heartbreak * 3.0,
    "emotionally-expensive": heartbreak * 1.8 + (heartbreak > manipulation ? 40 : 0),
    "delusional":            chaos * 2.0 + (manipulation < chaos * 0.5 ? 80 : 0),
    "toxic-queen":           (chaos + manipulation + heartbreak) * 0.65 + rf * 0.4,
    "main-character":        rf * 2.0 + (chaos < 120 && manipulation < 120 ? 60 : 0),
    "red-flag-energy":       (chaos + manipulation + heartbreak + rf) * 0.38,
  };
  return Object.entries(scores).sort(([, a], [, b]) => b - a)[0][0];
}

export const STORIES = [
  {
    id: "mariage-sabote",
    title: "MARIAGE SABOTÉ",
    emoji: "💍",
    tagline: "Ton ex se marie dans 48h.",
    description:
      "Le faire-part est arrivé chez toi... par erreur. Coïncidence ou destin ?",
    difficulty: "CHAOTIC",
    difficultyColor: "#E85C3A",
    available: true,
    scenes: [
      {
        id: "s1",
        title: "L'INVITATION",
        situation:
          "Une enveloppe crème avec un ruban doré est dans ta boîte aux lettres. C'est le faire-part de mariage de ton ex. Avec ton ancienne adresse. Le mariage : dans 48 heures.",
        tone: "💌",
        choices: [
          {
            id: "c1",
            text: "Appeler l'ex pour signaler que tu as reçu 'accidentellement' l'invitation",
            icon: "📞",
            rfTag: "STRATÉGIQUE",
            consequence:
              "Il/elle décroche après 2 sonneries, voix qui tremble. Un long silence. Tu gagnes la première manche sans avoir dit un mot.",
            stats: { chaos: 15, manipulation: 30, heartbreak: 10, rf: 200 },
          },
          {
            id: "c2",
            text: "Poster le faire-part en story Insta captionné 'Qui ça ?'",
            icon: "📱",
            rfTag: "CHAOTIQUE",
            consequence:
              "47 personnes regardent ta story en 8 minutes. Le futur conjoint reçoit 3 screenshots anonymes. Situation sous contrôle.",
            stats: { chaos: 35, manipulation: 10, heartbreak: 5, rf: 280 },
          },
          {
            id: "c3",
            text: "Envoyer des fleurs au lieu de cérémonie signées 'Avec tout mon amour toujours'",
            icon: "💐",
            rfTag: "ICONIC",
            consequence:
              "Le bouquet arrive pendant la répétition. Le traiteur lit l'étiquette à voix haute devant les familles. Absolument magnifique.",
            stats: { chaos: 50, manipulation: 20, heartbreak: 25, rf: 450 },
          },
        ],
      },
      {
        id: "s2",
        title: "LE MESSAGE",
        situation:
          "Ton ex t'envoie un message : 'On peut se parler ?' Il/elle n'a pas dormi. Ça se voit dans l'heure d'envoi : 3h47 du matin.",
        tone: "😰",
        choices: [
          {
            id: "c1",
            text: "Ne pas répondre pendant exactement 72 heures puis répondre 'Ça va ?'",
            icon: "🔇",
            rfTag: "GLACIAL",
            consequence:
              "Il/elle a envoyé 11 autres messages dans cet intervalle. Tu lis tout en silence. La patience est une arme.",
            stats: { chaos: 10, manipulation: 55, heartbreak: 20, rf: 380 },
          },
          {
            id: "c2",
            text: "'Je savais pas que tu te mariais !! Félicitations !!! 🥹🤍🥂'",
            icon: "💬",
            rfTag: "MASTERCLASS",
            consequence:
              "Gaslighting de haute voltige. Tu envoies tes condoléances déguisées en joie sincère. Chef-d'œuvre.",
            stats: { chaos: 20, manipulation: 70, heartbreak: 30, rf: 550 },
          },
          {
            id: "c3",
            text: "Appeler à 2h du mat, ne rien dire pendant 8 secondes, raccrocher",
            icon: "☎️",
            rfTag: "PSYCHOLOGIQUE",
            consequence:
              "Il/elle fixe son plafond jusqu'à 6h du matin. Le mariage est dans 24h. Timing parfait.",
            stats: { chaos: 40, manipulation: 50, heartbreak: 45, rf: 620 },
          },
        ],
      },
      {
        id: "s3",
        title: "LE FUTUR CONJOINT",
        situation:
          "Le/la futur(e) conjoint(e) t'a trouvé(e) et t'écrit : 'Je veux juste comprendre ce qui se passe. S'il vous plaît.'",
        tone: "😤",
        choices: [
          {
            id: "c1",
            text: "Raconter 3 vraies anecdotes mais dans le mauvais ordre pour que ça semble suspect",
            icon: "🎭",
            rfTag: "SUBTIL",
            consequence:
              "La confusion totale s'installe. Il/elle remet en question 3 ans de relation. Tu n'as pourtant rien dit de faux.",
            stats: { chaos: 30, manipulation: 75, heartbreak: 50, rf: 700 },
          },
          {
            id: "c2",
            text: "'Je pense juste que tout le monde mérite de connaître la vérité...' (silence complet)",
            icon: "🤫",
            rfTag: "DÉVASTATEUR",
            consequence:
              "L'implication sans la preuve. La suggestion sans l'accusation. Il/elle imagine le pire. Et tu n'as rien dit.",
            stats: { chaos: 25, manipulation: 85, heartbreak: 60, rf: 850 },
          },
          {
            id: "c3",
            text: "Envoyer une seule photo de vous deux à une époque heureuse et bloquer",
            icon: "🖼️",
            rfTag: "NUCLEAR",
            consequence:
              "Une image vaut mille mots. Et mille questions sans réponse. Tu es déjà parti(e). L'explosion se fait en ton absence.",
            stats: { chaos: 55, manipulation: 70, heartbreak: 75, rf: 950 },
          },
        ],
      },
      {
        id: "s4",
        title: "L'ÉPILOGUE",
        situation:
          "Le mariage a été annulé. Ton ex t'envoie un dernier message : 'Tu es content(e) maintenant ?'",
        tone: "🚩",
        choices: [
          {
            id: "c1",
            text: "'Alors tu m'en veux toujours ? Ça veut dire que tu y penses encore.' 😌",
            icon: "😈",
            rfTag: "CHEF-D'ŒUVRE",
            consequence:
              "Retournement rhétorique parfait. Il/elle raccroche mais la question reste. Tu as transformé une accusation en aveu de sa part.",
            stats: { chaos: 20, manipulation: 95, heartbreak: 35, rf: 1100 },
          },
          {
            id: "c2",
            text: "Répondre uniquement avec 🚩 et ne plus jamais donner de nouvelles",
            icon: "🚩",
            rfTag: "ICONIC",
            consequence:
              "Le symbole parfait pour conclure. Économique. Efficace. Impossible à mal interpréter. 10/10 sortie de scène.",
            stats: { chaos: 45, manipulation: 45, heartbreak: 25, rf: 900 },
          },
          {
            id: "c3",
            text: "Envoyer une photo de toi souriant(e) dans votre endroit préféré à tous les deux",
            icon: "📸",
            rfTag: "ULTRA",
            consequence:
              "Le coup de grâce émotionnel. La preuve que tu vas très bien. Que tu es passé(e) à autre chose. Dans LEUR endroit. Stratégie 10/10.",
            stats: { chaos: 40, manipulation: 80, heartbreak: 90, rf: 1200 },
          },
        ],
      },
    ],
  },
  {
    id: "side-piece-chronicles",
    title: "SIDE PIECE CHRONICLES",
    emoji: "💀",
    tagline: "Tu n'étais pas la seule personne dans cette relation.",
    description:
      "Tu viens de découvrir que tu étais l'autre. Mais maintenant tu connais l'autre aussi.",
    difficulty: "BRUTAL",
    difficultyColor: "#f43f5e",
    available: true,
    scenes: [
      {
        id: "s1",
        title: "LA DÉCOUVERTE",
        situation:
          "Tu fouilles les réseaux sociaux d'une amie d'amie et tu tombes sur des photos de TON mec/ta meuf avec quelqu'un d'autre. Des photos récentes. Très récentes.",
        tone: "🫠",
        choices: [
          {
            id: "c1",
            text: "Screenshotter discrètement et ne rien dire pendant 72h",
            icon: "📸",
            rfTag: "STRATÉGIQUE",
            consequence:
              "Tu accumules des preuves. Tu observes. Tu planifies. Dans 72h, tu seras prêt(e).",
            stats: { chaos: 5, manipulation: 40, heartbreak: 30, rf: 250 },
          },
          {
            id: "c2",
            text: "Envoyer les screenshots à l'autre personne sans commentaire",
            icon: "💌",
            rfTag: "CHAOTIQUE",
            consequence:
              "L'autre reçoit ça en pleine réunion. Votre partenaire commun reçoit un appel en panique 5 minutes après.",
            stats: { chaos: 45, manipulation: 30, heartbreak: 20, rf: 400 },
          },
          {
            id: "c3",
            text: "Like leur plus vieille photo ensemble de 2 ans en arrière",
            icon: "❤️",
            rfTag: "PSYCHOLOGIQUE",
            consequence:
              "Une notification anodine. Une terreur absolute. Ton/ta partenaire sait que tu sais. Et il/elle ne sait pas comment tu l'as su.",
            stats: { chaos: 30, manipulation: 65, heartbreak: 15, rf: 500 },
          },
        ],
      },
      {
        id: "s2",
        title: "LE RENDEZ-VOUS",
        situation:
          "Tu as demandé à voir ton/ta partenaire 'pour parler'. Il/elle arrive. Tu as les preuves sur ton téléphone.",
        tone: "😶‍🌫️",
        choices: [
          {
            id: "c1",
            text: "Poser le téléphone retourné sur la table et parler de n'importe quoi d'autre",
            icon: "📵",
            rfTag: "MASTERCLASS",
            consequence:
              "La tension monte. Il/elle essaie de voir l'écran discrètement depuis 20 minutes. Tu parles de météo.",
            stats: { chaos: 20, manipulation: 80, heartbreak: 25, rf: 650 },
          },
          {
            id: "c2",
            text: "Montrer les photos sans un mot et attendre",
            icon: "📱",
            rfTag: "DIRECT",
            consequence:
              "10 secondes de silence. Puis les excuses commencent. Puis les mensonges. Puis d'autres excuses. Tu écoutes tout.",
            stats: { chaos: 35, manipulation: 50, heartbreak: 60, rf: 700 },
          },
          {
            id: "c3",
            text: "Commander pour deux, commencer à manger, dire 'Comment ça se passe avec [son prénom] ?' entre deux bouchées",
            icon: "🍽️",
            rfTag: "CINÉMATIQUE",
            consequence:
              "Il/elle recrache son café. Tu continues à manger calmement. La scène est digne d'un film.",
            stats: { chaos: 50, manipulation: 75, heartbreak: 40, rf: 900 },
          },
        ],
      },
      {
        id: "s3",
        title: "L'AUTRE",
        situation:
          "L'autre personne t'a contacté(e). Elle est autant victime que toi. Vous avez un ennemi commun.",
        tone: "🤝",
        choices: [
          {
            id: "c1",
            text: "Proposer un café pour 'comparer les notes'",
            icon: "☕",
            rfTag: "STRATÉGIQUE",
            consequence:
              "Vous vous retrouvez avec 2 ans de preuves combinées. Une alliance se forme. La situation devient incontrôlable pour lui/elle.",
            stats: { chaos: 40, manipulation: 60, heartbreak: 30, rf: 800 },
          },
          {
            id: "c2",
            text: "Lui dire que tu lui pardonnes à lui/elle mais pas à l'autre",
            icon: "😇",
            rfTag: "DIVISEUR",
            consequence:
              "Tu transformes la victime en complice involontaire contre l'infidèle. Pur génie de la manipulation.",
            stats: { chaos: 30, manipulation: 90, heartbreak: 20, rf: 950 },
          },
          {
            id: "c3",
            text: "Ne pas répondre à l'autre et laisser votre partenaire gérer les deux situations",
            icon: "🍿",
            rfTag: "SPECTATEUR",
            consequence:
              "Tu t'installes confortablement pendant que l'incendie se propage. Parfois ne rien faire est le meilleur move.",
            stats: { chaos: 60, manipulation: 40, heartbreak: 10, rf: 700 },
          },
        ],
      },
      {
        id: "s4",
        title: "LA SORTIE",
        situation:
          "Ton/ta ex t'implore de garder ça entre vous. 'Pour les amis communs. Pour la famille.'",
        tone: "🚩",
        choices: [
          {
            id: "c1",
            text: "'Bien sûr.' (et ne rien promettre d'autre car tu n'as rien promis)",
            icon: "😌",
            rfTag: "LÉGAL",
            consequence:
              "La tranquillité de la vérité technique. Tu n'as pas promis de te taire. Tu as juste dit 'bien sûr'.",
            stats: { chaos: 20, manipulation: 95, heartbreak: 25, rf: 950 },
          },
          {
            id: "c2",
            text: "Poster une cryptic caption sur Insta que SEULEMENT lui/elle comprendra",
            icon: "🎯",
            rfTag: "CHIRURGICAL",
            consequence:
              "139 likes de gens qui ne comprennent pas. 1 like manquant de quelqu'un qui comprend trop bien.",
            stats: { chaos: 55, manipulation: 65, heartbreak: 30, rf: 1050 },
          },
          {
            id: "c3",
            text: "Devenir la meilleure version de toi-même et ne plus jamais te justifier",
            icon: "✨",
            rfTag: "ARC DE RÉDEMPTION",
            consequence:
              "Le revenge body. Le nouveau job. Les nouvelles photos. La vie qui continue. La vengeance ultime : ta propre réussite.",
            stats: { chaos: 10, manipulation: 30, heartbreak: 5, rf: 1500 },
          },
        ],
      },
    ],
  },
  {
    id: "family-chaos",
    title: "FAMILY CHAOS",
    emoji: "🦃",
    tagline: "Noël va être mémorable.",
    description:
      "Ta belle-famille a organisé Noël sans t'inviter. À tort ou à raison, ils vont s'en souvenir.",
    difficulty: "POLITIQUE",
    difficultyColor: "#a855f7",
    available: true,
    scenes: [
      {
        id: "s1",
        title: "L'EXCLUSION",
        situation:
          "Tu découvres que toute la belle-famille se réunit pour les fêtes. Tu n'as reçu aucune invitation. Ton/ta partenaire 'avait oublié de te le dire'.",
        tone: "🙄",
        choices: [
          {
            id: "c1",
            text: "Faire semblant de ne pas savoir et attendre que ton/ta partenaire annonce",
            icon: "😇",
            rfTag: "PATIENT",
            consequence:
              "Il/elle bredouille une explication. Plus il/elle explique, plus c'est pire. Tu acquiesces doucement.",
            stats: { chaos: 10, manipulation: 60, heartbreak: 15, rf: 300 },
          },
          {
            id: "c2",
            text: "Envoyer un message enthousiaste à la belle-famille : 'On se retrouve quand pour Noël ?!'",
            icon: "🎄",
            rfTag: "CHAOS PASSIF",
            consequence:
              "La belle-mère panique. Ton/ta partenaire reçoit 4 appels dans l'heure. Quelqu'un doit désormais mentir. Ce n'est pas toi.",
            stats: { chaos: 50, manipulation: 45, heartbreak: 10, rf: 550 },
          },
          {
            id: "c3",
            text: "Organiser ton propre Noël avec tes amis le même jour et poster non-stop",
            icon: "🥂",
            rfTag: "PRINCIPAL ENERGY",
            consequence:
              "Ta fête a l'air 10x plus fun. Les photos sont magnifiques. Leur Noël familial est hanté par ton absence stylée.",
            stats: { chaos: 30, manipulation: 20, heartbreak: 5, rf: 700 },
          },
        ],
      },
      {
        id: "s2",
        title: "LA BELLE-MÈRE",
        situation:
          "La belle-mère te contacte finalement : 'On pensait que tu n'étais pas disponible...' avec un emoji smiley.",
        tone: "😬",
        choices: [
          {
            id: "c1",
            text: "'Pas de problème du tout ! Je comprends tout à fait 😊'",
            icon: "🤗",
            rfTag: "SARCASME MAXIMUM",
            consequence:
              "L'enthousiasme excessif crée une atmosphère plus inconfortable que la colère. Elle ne sait pas si tu es sincère ou pas.",
            stats: { chaos: 25, manipulation: 70, heartbreak: 5, rf: 500 },
          },
          {
            id: "c2",
            text: "Répondre avec un délai de 3 jours et un simple 'Ah.'",
            icon: "📩",
            rfTag: "MINIMALISTE",
            consequence:
              "Un monosyllabe qui pèse 10 tonnes. Elle le montre à son fils/sa fille. Discussion familiale enflammée.",
            stats: { chaos: 35, manipulation: 65, heartbreak: 10, rf: 600 },
          },
          {
            id: "c3",
            text: "L'appeler pour qu'elle 'entende ta voix et voie que tu vas bien'",
            icon: "📞",
            rfTag: "CINÉMATIQUE",
            consequence:
              "Tu parles pendant 45 minutes de tout et de rien avec une voix parfaitement composée. Elle raccroche troublée.",
            stats: { chaos: 20, manipulation: 80, heartbreak: 5, rf: 700 },
          },
        ],
      },
      {
        id: "s3",
        title: "LE RÉVEILLON",
        situation:
          "Tu es finalement invité(e) — sous pression de ton/ta partenaire. Tu arrives. Tout le monde est mal à l'aise. Toi, non.",
        tone: "😏",
        choices: [
          {
            id: "c1",
            text: "Être absolument charmant(e) et parfait(e) toute la soirée",
            icon: "✨",
            rfTag: "DEVASTATEUR",
            consequence:
              "Ta perfection rend leur comportement d'exclusion encore plus indefendable. Ils ne peuvent pas te critiquer. C'est insupportable pour eux.",
            stats: { chaos: 15, manipulation: 85, heartbreak: 5, rf: 850 },
          },
          {
            id: "c2",
            text: "Raconter des anecdotes qui prouvent subtilement que tu es indispensable",
            icon: "🗣️",
            rfTag: "NARCISSIQUE",
            consequence:
              "3 anecdotes légèrement exagérées. Chacune positionne ton/ta partenaire comme ayant besoin de toi. La belle-famille recalcule.",
            stats: { chaos: 25, manipulation: 90, heartbreak: 15, rf: 950 },
          },
          {
            id: "c3",
            text: "Proposer d'organiser Pâques chez toi 'pour rendre la pareille'",
            icon: "🐣",
            rfTag: "PRISE DE TERRITOIRE",
            consequence:
              "Tu viens d'installer ton drapeau dans leur territoire annuel. Ils n'ont pas pu refuser devant tout le monde.",
            stats: { chaos: 40, manipulation: 75, heartbreak: 5, rf: 900 },
          },
        ],
      },
      {
        id: "s4",
        title: "LE LENDEMAIN",
        situation:
          "Le lendemain, ton/ta partenaire te dit que 'ça s'est plutôt bien passé non ?' Il/elle croit vraiment que tu as oublié.",
        tone: "🚩",
        choices: [
          {
            id: "c1",
            text: "'Oui ! Ta famille est adorable.' (et ne plus jamais aborder le sujet de ta vie)",
            icon: "😌",
            rfTag: "STRATÉGIQUE",
            consequence:
              "Le silence devient ta puissance. Tu sais. Il/elle ne sait pas que tu sais. Tu attends le prochain épisode.",
            stats: { chaos: 15, manipulation: 95, heartbreak: 10, rf: 1000 },
          },
          {
            id: "c2",
            text: "Lui demander calmement de 't'expliquer ce qui s'est passé avec l'invitation'",
            icon: "🧊",
            rfTag: "CONFRONTATION FROIDE",
            consequence:
              "La conversation dure 3 heures. Tu écoutes tout. Tu ne hausses jamais la voix. C'est pour ça que c'est efficace.",
            stats: { chaos: 30, manipulation: 70, heartbreak: 35, rf: 900 },
          },
          {
            id: "c3",
            text: "Commencer à planifier un voyage seul(e) pendant les prochaines fêtes sans rien annoncer",
            icon: "✈️",
            rfTag: "PROACTIF",
            consequence:
              "Tu achètes les billets. Tu ne dis rien. Le jour J, tu pars. La leçon est retenue pour toujours.",
            stats: { chaos: 50, manipulation: 60, heartbreak: 20, rf: 1100 },
          },
        ],
      },
    ],
  },
  {
    id: "love-triangle",
    title: "LOVE TRIANGLE",
    emoji: "🔺",
    tagline: "Trois personnes. Trop peu de place.",
    description:
      "Ton meilleur ami sort avec ton ex. Depuis 3 mois. Sans te le dire.",
    difficulty: "BRUTAL",
    difficultyColor: "#f43f5e",
    available: true,
    scenes: [
      {
        id: "s1",
        title: "LA RÉVÉLATION",
        situation:
          "Tu scrolles Instagram et tu tombes sur une photo de ton meilleur ami en date avec ton ex. Les hashtags : #nouveaucouple #bonheur. Ça date de 3 mois.",
        tone: "🫠",
        choices: [
          {
            id: "c1",
            text: "Liker la photo avec un grand sourire 😊 et ne rien dire",
            icon: "❤️",
            rfTag: "SILENCIEUX",
            consequence:
              "Ton like arrive à 3h du matin. Ils voient tous les deux la notification. La panique s'installe sans que tu aies dit un mot.",
            stats: { chaos: 20, manipulation: 65, heartbreak: 15, rf: 400 },
          },
          {
            id: "c2",
            text: "Appeler ton meilleur ami en mode 'j'ai vu ta photo, trop content pour toi !'",
            icon: "📞",
            rfTag: "MASTERCLASS",
            consequence:
              "Il bégaie. Il s'attendait à de la colère. Ta joie simulée est bien plus déstabilisante. Il passe la nuit à culpabiliser.",
            stats: { chaos: 15, manipulation: 80, heartbreak: 20, rf: 550 },
          },
          {
            id: "c3",
            text: "Envoyer à ton ex 'Contente pour toi 🙂' — juste ça",
            icon: "💬",
            rfTag: "CHIRURGICAL",
            consequence:
              "Un smiley qui pèse 10 tonnes. Ton ex montre le message à ton ami. Discussion tendue à 23h.",
            stats: { chaos: 30, manipulation: 70, heartbreak: 35, rf: 600 },
          },
        ],
      },
      {
        id: "s2",
        title: "LE DÎNER",
        situation:
          "Ton meilleur ami t'invite à dîner 'pour t'expliquer'. Ton ex sera là aussi. Tu acceptes.",
        tone: "🍽️",
        choices: [
          {
            id: "c1",
            text: "Arriver 20 minutes en retard, souriant(e), comme si tout allait bien",
            icon: "😌",
            rfTag: "DOMINANT",
            consequence:
              "Ils t'attendaient en silence depuis 20 min. Ton calme à l'arrivée leur enlève tout avantage. Tu contrôles la soirée.",
            stats: { chaos: 25, manipulation: 75, heartbreak: 20, rf: 650 },
          },
          {
            id: "c2",
            text: "Raconter une anecdote drôle sur ton ex en la regardant dans les yeux",
            icon: "🎭",
            rfTag: "PSYCHOLOGIQUE",
            consequence:
              "Tu rappelles que tu la connais mieux qu'eux deux réunis. Elle rit nerveusement. Lui ne sait pas quoi faire.",
            stats: { chaos: 30, manipulation: 85, heartbreak: 40, rf: 750 },
          },
          {
            id: "c3",
            text: "Sortir ton téléphone et montrer des vieilles photos 'pour les souvenirs'",
            icon: "📱",
            rfTag: "NOSTALGIQUE",
            consequence:
              "Des photos de toi avec ton ex, des photos de toi avec ton ami. Les deux ensemble. Regards croisés. Dîner terminé.",
            stats: { chaos: 50, manipulation: 70, heartbreak: 60, rf: 850 },
          },
        ],
      },
      {
        id: "s3",
        title: "LA CONFIDENCE",
        situation:
          "Ton meilleur ami te prend à part : 'Je t'aurais dû te dire avant. Pardonne-moi.' Il a l'air sincère.",
        tone: "😶",
        choices: [
          {
            id: "c1",
            text: "'C'est bon, vraiment.' (et ne plus jamais répondre à ses messages dans les mêmes délais)",
            icon: "🕐",
            rfTag: "LONG GAME",
            consequence:
              "Tu réponds toujours, mais avec 4h de délai systématique. Il remarque. Il n'ose pas en parler.",
            stats: { chaos: 15, manipulation: 90, heartbreak: 25, rf: 800 },
          },
          {
            id: "c2",
            text: "'Je comprends. J'aurais fait pareil à ta place.' (tu n'aurais pas fait pareil)",
            icon: "😇",
            rfTag: "GASLIGHTING",
            consequence:
              "Il repart soulagé puis réalise 3 jours plus tard que ta phrase ne veut rien dire. Confusion totale.",
            stats: { chaos: 20, manipulation: 95, heartbreak: 20, rf: 900 },
          },
          {
            id: "c3",
            text: "Lui raconter un 'secret' sur son ex que tu n'aurais jamais dû révéler",
            icon: "🤫",
            rfTag: "NUCLEAR",
            consequence:
              "Tu viens de planter une bombe à retardement dans leur relation. Pas de ta faute — tu essayais juste d'être honnête.",
            stats: { chaos: 60, manipulation: 75, heartbreak: 50, rf: 1000 },
          },
        ],
      },
      {
        id: "s4",
        title: "L'ÉPILOGUE",
        situation:
          "3 semaines plus tard. Ton ami et ton ex ont rompu. Il t'appelle : 'T'avais raison depuis le début.'",
        tone: "🚩",
        choices: [
          {
            id: "c1",
            text: "'J'avais rien dit.' (vrai, techniquement)",
            icon: "😌",
            rfTag: "LÉGENDAIRE",
            consequence:
              "La phrase parfaite. Tu n'as rien fait de mal. Et pourtant tout s'est passé exactement comme prévu.",
            stats: { chaos: 10, manipulation: 100, heartbreak: 15, rf: 1200 },
          },
          {
            id: "c2",
            text: "Proposer un verre 'pour rattraper le temps perdu'",
            icon: "🥂",
            rfTag: "RÉCUPÉRATION",
            consequence:
              "Tu reprends ta place dans sa vie. Comme si rien ne s'était passé. Parce que rien ne s'est passé. Officiellement.",
            stats: { chaos: 20, manipulation: 80, heartbreak: 10, rf: 1000 },
          },
          {
            id: "c3",
            text: "Ne pas répondre. Laisser sonner. Regarder l'écran.",
            icon: "📵",
            rfTag: "FINAL BOSS",
            consequence:
              "Le silence comme conclusion. Il comprend tout. Tu n'as rien à expliquer. C'est le move le plus puissant que tu aies fait.",
            stats: { chaos: 30, manipulation: 85, heartbreak: 30, rf: 1300 },
          },
        ],
      },
    ],
  },
  {
    id: "work-enemy",
    title: "OFFICE VILLAIN",
    emoji: "💼",
    tagline: "Ton patron t'a volé ton idée. Devant tout le monde.",
    description:
      "En réunion. Avec tes slides. Et ton nom effacé de la présentation.",
    difficulty: "CORPORATIF",
    difficultyColor: "#06b6d4",
    available: true,
    scenes: [
      {
        id: "s1",
        title: "LA RÉUNION",
        situation:
          "Ton patron présente 'son' idée — ton idée — à la direction. Avec tes chiffres. Tes mots. Ton travail. Il ne te regarde même pas.",
        tone: "😤",
        choices: [
          {
            id: "c1",
            text: "Poser une question technique ultra-précise que seul l'auteur original peut répondre",
            icon: "🎯",
            rfTag: "CHIRURGICAL",
            consequence:
              "Il bégaie. La direction le regarde. Tu souris poliment. Tout le monde comprend sans que tu aies rien accusé.",
            stats: { chaos: 20, manipulation: 85, heartbreak: 10, rf: 600 },
          },
          {
            id: "c2",
            text: "Envoyer les emails originaux à toute l'équipe 'pour partager les ressources'",
            icon: "📧",
            rfTag: "PREUVE",
            consequence:
              "Les timestamps parlent d'eux-mêmes. Tu n'as rien dit de négatif. Les faits font le travail à ta place.",
            stats: { chaos: 35, manipulation: 70, heartbreak: 5, rf: 700 },
          },
          {
            id: "c3",
            text: "Rester silencieux(se) et noter tout dans un document daté",
            icon: "📝",
            rfTag: "STRATÉGIQUE",
            consequence:
              "Tu construis le dossier. La vengeance est un plat qui se mange froid et bien documenté.",
            stats: { chaos: 10, manipulation: 60, heartbreak: 5, rf: 500 },
          },
        ],
      },
      {
        id: "s2",
        title: "L'AFTER",
        situation:
          "Ton patron te prend à part après la réunion : 'Tu as fait du bon travail. Je t'ai mis en valeur.' Il croit vraiment ce qu'il dit.",
        tone: "🤡",
        choices: [
          {
            id: "c1",
            text: "'Merci. J'ai d'autres idées dans ce style si tu veux qu'on en parle.' (tu ne lui montreras rien)",
            icon: "😊",
            rfTag: "PIÈGE",
            consequence:
              "Il est enthousiaste. Il attend. Tu ne montres rien. Il commence à douter de lui-même.",
            stats: { chaos: 20, manipulation: 90, heartbreak: 5, rf: 750 },
          },
          {
            id: "c2",
            text: "Le remercier chaleureusement et CC son supérieur dans le prochain mail de suivi",
            icon: "📨",
            rfTag: "POLITIQUE",
            consequence:
              "Son supérieur voit maintenant tous tes échanges. Contexte établi. Hiérarchie informée.",
            stats: { chaos: 25, manipulation: 80, heartbreak: 5, rf: 800 },
          },
          {
            id: "c3",
            text: "Dire 'Je vais préparer la suite alors' et envoyer la V2 directement à la direction",
            icon: "🚀",
            rfTag: "BYPASS",
            consequence:
              "Tu courts-circuites la chaîne. Légitimement. La direction te répond directement. Il n'est plus dans la boucle.",
            stats: { chaos: 40, manipulation: 75, heartbreak: 5, rf: 900 },
          },
        ],
      },
      {
        id: "s3",
        title: "L'ALLIÉ",
        situation:
          "Un(e) collègue t'approche : 'J'ai tout vu. C'était ton idée. Qu'est-ce qu'on fait ?'",
        tone: "🤝",
        choices: [
          {
            id: "c1",
            text: "'Rien pour l'instant. Mais garde ça en tête.' (tu constitues ta coalition)",
            icon: "🧩",
            rfTag: "COALITION",
            consequence:
              "Tu as maintenant un témoin, un allié, et une stratégie long terme. La patience est une arme.",
            stats: { chaos: 15, manipulation: 85, heartbreak: 5, rf: 850 },
          },
          {
            id: "c2",
            text: "Lui montrer les preuves et lui demander de témoigner si nécessaire",
            icon: "📁",
            rfTag: "DOSSIER",
            consequence:
              "Ton dossier prend de l'épaisseur. Tu n'es plus seul(e). Le terrain est préparé.",
            stats: { chaos: 20, manipulation: 70, heartbreak: 5, rf: 800 },
          },
          {
            id: "c3",
            text: "Lui dire 'Laisse tomber' et agir seul(e) — moins de risques de fuites",
            icon: "🔒",
            rfTag: "SOLO",
            consequence:
              "Tu joues seul(e). Plus risqué mais plus propre. Aucune fuite possible.",
            stats: { chaos: 25, manipulation: 65, heartbreak: 5, rf: 700 },
          },
        ],
      },
      {
        id: "s4",
        title: "LE COUP FINAL",
        situation:
          "Entretien annuel. Ton patron te donne une 'bonne' évaluation mais sans promotion. 'L'année prochaine peut-être.'",
        tone: "🚩",
        choices: [
          {
            id: "c1",
            text: "Poser ta démission sur la table et avoir déjà signé ailleurs",
            icon: "✉️",
            rfTag: "NUCLEAR",
            consequence:
              "Tu pars avec tout ton portfolio, tes idées, et une offre 30% au-dessus. Il doit maintenant expliquer ton départ à la direction.",
            stats: { chaos: 50, manipulation: 60, heartbreak: 5, rf: 1200 },
          },
          {
            id: "c2",
            text: "Demander une augmentation avec un dossier béton incluant tout ce que tu as 'contribué'",
            icon: "💰",
            rfTag: "FACTUEL",
            consequence:
              "Le dossier liste chaque idée, chaque résultat, chaque date. Il ne peut pas refuser sans s'incriminer.",
            stats: { chaos: 20, manipulation: 90, heartbreak: 5, rf: 1100 },
          },
          {
            id: "c3",
            text: "'D'accord. J'ai besoin de réfléchir.' (tu as déjà un entretien demain matin)",
            icon: "😌",
            rfTag: "ÉLÉGANT",
            consequence:
              "La sortie la plus classe. Tu ne claques pas la porte. Elle se ferme toute seule derrière toi.",
            stats: { chaos: 15, manipulation: 75, heartbreak: 5, rf: 1000 },
          },
        ],
      },
    ],
  },
  {
    id: "ex-en-vacances",
    title: "EX EN VACANCES",
    emoji: "🌴",
    tagline: "Même hôtel. Même piscine. Même ex.",
    description: "Tu t'offres enfin des vacances de rêve. Ton ex aussi. Avec quelqu'un d'autre.",
    difficulty: "TROPICAL CHAOS",
    difficultyColor: "#06b6d4",
    available: true,
    scenes: [
      {
        id: "s1",
        title: "LA PISCINE",
        situation: "Jour 1. Tu poses ta serviette au bord de la piscine. Tu lèves la tête. Ton ex est là, à 8 mètres, avec une nouvelle personne. Lunettes de soleil. Cocktail. Sans te voir encore.",
        tone: "😎",
        choices: [
          {
            id: "c1",
            text: "Mettre tes AirPods, commander le même cocktail qu'eux, et t'allonger à 3 mètres",
            icon: "🍹",
            rfTag: "PROXIMITÉE CALCULÉE",
            consequence: "Tu es là depuis 4 minutes quand il/elle te voit. Le cocktail à la main. Le sourire décontracté. L'effet est immédiat.",
            stats: { chaos: 30, manipulation: 60, heartbreak: 20, rf: 450 },
          },
          {
            id: "c2",
            text: "Poster une story depuis la piscine avec une caption 'best solo trip ever 🌴'",
            icon: "📱",
            rfTag: "STRATÉGIQUE",
            consequence: "Il/elle voit la story dans la seconde. L'algorithme vous réunit. Tu n'as rien fait.",
            stats: { chaos: 25, manipulation: 45, heartbreak: 10, rf: 350 },
          },
          {
            id: "c3",
            text: "Changer de transat pour être dans leur champ de vision direct et lire un livre",
            icon: "📚",
            rfTag: "CASUAL DEVASTATEUR",
            consequence: "Tu lis. Tu ris parfois. Avec toi-même. C'est plus perturbant que n'importe quelle scène.",
            stats: { chaos: 20, manipulation: 70, heartbreak: 15, rf: 500 },
          },
        ],
      },
      {
        id: "s2",
        title: "LE DÎNER",
        situation: "Restaurant de l'hôtel. Même soir. L'hôtesse te place à la table adjacente à celle de ton ex. Le destin fait bien les choses — ou c'est toi qui as demandé cette table spécifiquement.",
        tone: "🍽️",
        choices: [
          {
            id: "c1",
            text: "Dire bonjour chaleureusement, féliciter le/la nouveau(elle) partenaire pour son 'bon goût en voyage'",
            icon: "🥂",
            rfTag: "AMBIGUÏTÉ TOXIQUE",
            consequence: "Ton ex ne sait pas si c'est un compliment ou une attaque. Son/sa partenaire non plus. Le dîner dure 2h de malaise productif.",
            stats: { chaos: 35, manipulation: 80, heartbreak: 25, rf: 700 },
          },
          {
            id: "c2",
            text: "Appeler un(e) ami(e) fort(e) et rire aux éclats pendant tout le repas",
            icon: "😂",
            rfTag: "PERFORMANCE",
            consequence: "Tu as l'air de passer la meilleure soirée de ta vie. C'est peut-être vrai. C'est pire.",
            stats: { chaos: 30, manipulation: 55, heartbreak: 10, rf: 550 },
          },
          {
            id: "c3",
            text: "Commander du champagne pour toi seul(e) et demander au serveur de 'ne pas déranger la table d'à côté'",
            icon: "🍾",
            rfTag: "ROYAL",
            consequence: "Le serveur leur répète l'info. Ils boivent leur vin en se demandant ce que ça veut dire. Tu bois ton champagne en sachant exactement ce que ça veut dire.",
            stats: { chaos: 45, manipulation: 85, heartbreak: 30, rf: 850 },
          },
        ],
      },
      {
        id: "s3",
        title: "L'EXCURSION",
        situation: "Tu t'es inscrit(e) à la sortie bateau. Ton ex aussi. Vous êtes sur le même bateau pendant 4 heures. Il/elle est mal à l'aise. Toi, pas du tout.",
        tone: "⛵",
        choices: [
          {
            id: "c1",
            text: "Proposer de faire la photo de couple pour eux avec ton téléphone (et garder ton fond d'écran)",
            icon: "📸",
            rfTag: "SADIQUE BIENVEILLANT",
            consequence: "Tu fais la photo. Elle est parfaite. Tu as maintenant une photo d'eux deux dans ta galerie. Ce n'est pas normal.",
            stats: { chaos: 20, manipulation: 90, heartbreak: 55, rf: 800 },
          },
          {
            id: "c2",
            text: "Te lier d'amitié avec les autres touristes et former un groupe que ton ex essaie d'intégrer",
            icon: "🤝",
            rfTag: "TERRITOIRE",
            consequence: "Tu contrôles les interactions sociales du bateau. Ton ex doit passer par toi pour parler aux autres. Dynamique renversée.",
            stats: { chaos: 25, manipulation: 75, heartbreak: 20, rf: 700 },
          },
          {
            id: "c3",
            text: "Bronzer face au soleil en silence total pendant que tout le monde parle autour de toi",
            icon: "☀️",
            rfTag: "ZEN CHAOTIQUE",
            consequence: "Ton détachement apparent est la chose la plus déstabilisante du voyage. Tu ne fais rien. C'est pour ça que c'est efficace.",
            stats: { chaos: 15, manipulation: 65, heartbreak: 10, rf: 600 },
          },
        ],
      },
      {
        id: "s4",
        title: "LE DERNIER SOIR",
        situation: "Dernier soir à l'hôtel. Ton ex vient te voir seul(e) au bar : 'C'était bizarre de te croiser ici. Tu vas bien vraiment ?'",
        tone: "🚩",
        choices: [
          {
            id: "c1",
            text: "'Jamais été aussi bien.' (et c'est vrai, c'est là que ça fait le plus mal)",
            icon: "😌",
            rfTag: "VÉRITÉ CRUELLE",
            consequence: "Il/elle te regarde. Il/elle cherche le mensonge. Il/elle ne le trouve pas. Ce soir-là, il/elle ne dort pas.",
            stats: { chaos: 10, manipulation: 85, heartbreak: 40, rf: 950 },
          },
          {
            id: "c2",
            text: "Commander deux verres sans demander et parler comme si vous étiez de vieux amis",
            icon: "🥃",
            rfTag: "RÉÉCRITURE",
            consequence: "Tu réécris l'histoire en temps réel. La rupture devient une anecdote. Ton ex rentre chez lui/elle confus(e) et nostalgique.",
            stats: { chaos: 30, manipulation: 80, heartbreak: 60, rf: 1100 },
          },
          {
            id: "c3",
            text: "Répondre 'Passe une bonne nuit.' — et partir avant qu'il/elle finisse sa phrase",
            icon: "🚶",
            rfTag: "EXIT PARFAIT",
            consequence: "La sortie de scène ultime. Tu pars en vacances avec toi-même. Tu repars avec la victoire.",
            stats: { chaos: 40, manipulation: 70, heartbreak: 25, rf: 1200 },
          },
        ],
      },
    ],
  },
  {
    id: "erreur-de-groupe",
    title: "ERREUR DE GROUPE",
    emoji: "📱",
    tagline: "3 ex. 1 groupe WhatsApp. 0 excuse.",
    description: "Quelqu'un a créé un groupe WhatsApp avec tous tes ex. Tu viens d'être ajouté(e). Par erreur.",
    difficulty: "DIGITAL WARFARE",
    difficultyColor: "#a855f7",
    available: true,
    scenes: [
      {
        id: "s1",
        title: "LE GROUPE",
        situation: "23h47. Une notification : tu as été ajouté(e) dans un groupe 'Réunion amis' avec 3 ex-partenaires, un ami commun, et une personne que tu ne connais pas. Silence dans le groupe depuis 2 minutes.",
        tone: "😳",
        choices: [
          {
            id: "c1",
            text: "Envoyer 'Intéressant comme liste de contacts 👀' et ne plus rien écrire",
            icon: "👀",
            rfTag: "OUVERTURE DE PARTIE",
            consequence: "Le groupe explose en activité. Tu as dit 5 mots. Tu as tout déclenché. Tu poses ton téléphone.",
            stats: { chaos: 40, manipulation: 65, heartbreak: 10, rf: 550 },
          },
          {
            id: "c2",
            text: "Ne rien dire et lire en silence tous les messages qui arrivent dans les 10 prochaines minutes",
            icon: "🔇",
            rfTag: "OBSERVATEUR",
            consequence: "Les autres commencent à écrire pour briser le silence. Chaque message révèle quelque chose. Tu prends des notes mentales.",
            stats: { chaos: 10, manipulation: 70, heartbreak: 15, rf: 400 },
          },
          {
            id: "c3",
            text: "Répondre à l'inconnu(e) directement : 'Salut, tu es qui exactement ?'",
            icon: "❓",
            rfTag: "CHAOS IMMÉDIAT",
            consequence: "L'inconnu(e) s'avère être le/la nouveau(elle) partenaire d'un de tes ex. La soirée prend une nouvelle dimension.",
            stats: { chaos: 55, manipulation: 40, heartbreak: 25, rf: 600 },
          },
        ],
      },
      {
        id: "s2",
        title: "LES RÉVÉLATIONS",
        situation: "L'ami commun essaie de calmer le groupe : 'C'est une erreur, j'ai mélangé les groupes, désolé.' Mais maintenant tout le monde voit tout le monde. Et personne ne part.",
        tone: "😬",
        choices: [
          {
            id: "c1",
            text: "Répondre 'C'est bon, je reste. Plus pratique pour la suite 😇'",
            icon: "😇",
            rfTag: "INSTALLATION",
            consequence: "L'ami commun est horrifié. Tes ex sont silencieux. Tu viens de transformer l'erreur en stratégie.",
            stats: { chaos: 35, manipulation: 75, heartbreak: 20, rf: 700 },
          },
          {
            id: "c2",
            text: "Envoyer une vieille photo d'un souvenir commun avec l'un des ex 'pour l'ambiance'",
            icon: "🖼️",
            rfTag: "MINE TERRESTRE",
            consequence: "Les 3 ex voient la photo. Deux d'entre eux ne savaient pas que tu avais encore ça. L'un reconnaît l'endroit.",
            stats: { chaos: 50, manipulation: 80, heartbreak: 40, rf: 850 },
          },
          {
            id: "c3",
            text: "Créer un sondage 'Qui est le plus surpris d'être dans ce groupe ?' avec vos prénoms à tous",
            icon: "📊",
            rfTag: "GAME SHOW",
            consequence: "5 personnes votent en 3 minutes. Le résultat est humiliant pour quelqu'un. Ce n'est pas toi.",
            stats: { chaos: 60, manipulation: 55, heartbreak: 15, rf: 750 },
          },
        ],
      },
      {
        id: "s3",
        title: "L'ESCALADE",
        situation: "Un de tes ex commence à écrire des messages pour s'expliquer sur 'ce qui s'est passé entre vous'. Dans le groupe. Devant tout le monde.",
        tone: "🫠",
        choices: [
          {
            id: "c1",
            text: "Répondre uniquement avec des emojis 🙂 à chaque message qu'il/elle envoie",
            icon: "🙂",
            rfTag: "PASSIF-AGRESSIF ÉLÉGANT",
            consequence: "Il/elle écrit de plus en plus longtemps. Tu réponds 🙂. Les autres regardent. Personne n'intervient.",
            stats: { chaos: 25, manipulation: 90, heartbreak: 30, rf: 900 },
          },
          {
            id: "c2",
            text: "Ignorer son message et demander à l'inconnu(e) sa recette de la semaine",
            icon: "🍳",
            rfTag: "DÉCALAGE TOTAL",
            consequence: "Le changement de sujet est si brutal que tout le monde rit. Sauf l'ex qui s'explique encore dans le vide.",
            stats: { chaos: 45, manipulation: 70, heartbreak: 20, rf: 800 },
          },
          {
            id: "c3",
            text: "Écrire 'Je pense qu'on devrait tous se retrouver IRL pour en parler 🙂' avec l'adresse d'un café",
            icon: "☕",
            rfTag: "ESCALADE FINALE",
            consequence: "3 personnes disent oui. L'ami commun quitte le groupe. La réunion de tes ex est confirmée pour samedi.",
            stats: { chaos: 70, manipulation: 65, heartbreak: 35, rf: 1000 },
          },
        ],
      },
      {
        id: "s4",
        title: "LA SORTIE",
        situation: "Le groupe est toujours actif à 2h du matin. 47 messages. Tu es la seule personne à ne pas avoir quitté le groupe. Tous les autres ont quitté. Sauf toi.",
        tone: "🚩",
        choices: [
          {
            id: "c1",
            text: "Renommer le groupe 'Mon ex museum 🏛️' et rester dedans pour toujours",
            icon: "🏛️",
            rfTag: "MONUMENT",
            consequence: "Le groupe renommé reste dans ton historique. Un jour quelqu'un rouvre l'application et voit le nom. Ce jour-là, tu gagnes.",
            stats: { chaos: 30, manipulation: 80, heartbreak: 10, rf: 1100 },
          },
          {
            id: "c2",
            text: "Envoyer un dernier message 'Bonne nuit à tous ❤️' et couper les notifications",
            icon: "🌙",
            rfTag: "CLÔTURE EN BEAUTÉ",
            consequence: "Le cœur rouge à 2h du matin dans ce groupe précis est le message le plus ambigu de ta vie. Et c'est voulu.",
            stats: { chaos: 40, manipulation: 75, heartbreak: 25, rf: 1000 },
          },
          {
            id: "c3",
            text: "Quitter le groupe silencieusement à 2h03 — après avoir tout lu",
            icon: "👋",
            rfTag: "SORTIE PARFAITE",
            consequence: "La notification 'X a quitté le groupe' à 2h03 est le dernier message. Personne ne sait ce que tu as vu. Tu sais tout.",
            stats: { chaos: 20, manipulation: 95, heartbreak: 15, rf: 1200 },
          },
        ],
      },
    ],
  },
  {
    id: "retour-du-ghoste",
    title: "RETOUR DU GHOSTÉ",
    emoji: "👻",
    tagline: "Tu l'as ghosté(e) il y a 6 mois. Il/elle revient.",
    description:
      "Un 'coucou' à 11h47 un dimanche. Comme si rien ne s'était passé. Comme si tu n'avais pas vu ses 11 messages sans répondre.",
    difficulty: "MINDFUCK",
    difficultyColor: "#a855f7",
    available: true,
    scenes: [
      {
        id: "s1",
        title: "LE COUCOU",
        situation:
          "11h47, dimanche matin. Ton téléphone vibre. C'est lui/elle. Juste 'coucou 🙂'. Rien d'autre. Après 6 mois de silence total — le tien.",
        tone: "👻",
        choices: [
          {
            id: "c1",
            text: "Ouvrir le message, attendre 3 heures, répondre 'Coucou ?' avec le point d'interrogation",
            icon: "❓",
            rfTag: "MIROIR",
            consequence:
              "Le point d'interrogation fait tout le travail. Il/elle ne sait pas si tu ne te souviens pas ou si tu fais semblant. Les deux sont dévastateurs.",
            stats: { chaos: 20, manipulation: 85, heartbreak: 10, rf: 600 },
          },
          {
            id: "c2",
            text: "Ne pas répondre et poster une story 12 minutes après",
            icon: "📱",
            rfTag: "VU ET IGNORÉ",
            consequence:
              "Il/elle voit que tu es actif(ve). Il/elle voit sa propre bulle de message toujours sans réponse. L'humiliation en temps réel.",
            stats: { chaos: 30, manipulation: 75, heartbreak: 15, rf: 550 },
          },
          {
            id: "c3",
            text: "Répondre 'Ça fait longtemps !' avec un enthousiasme parfaitement calibré",
            icon: "😄",
            rfTag: "ACCUEIL PIÈGE",
            consequence:
              "Tu sembles ravi(e). Il/elle est soulagé(e). Il/elle va maintenant tout expliquer, se justifier, s'excuser. Et tu vas écouter.",
            stats: { chaos: 15, manipulation: 90, heartbreak: 20, rf: 700 },
          },
        ],
      },
      {
        id: "s2",
        title: "L'EXPLICATION",
        situation:
          "Il/elle t'envoie un long message pour expliquer pourquoi il/elle avait disparu. 'J'avais besoin de temps. Mais je pense souvent à toi.' 312 mots.",
        tone: "📝",
        choices: [
          {
            id: "c1",
            text: "Répondre uniquement 'Je vois.' et rien d'autre",
            icon: "😶",
            rfTag: "ÉCONOMIQUE",
            consequence:
              "Deux mots pour répondre à 312. Le ratio est parfait. Il/elle attend la suite pendant 2 jours.",
            stats: { chaos: 15, manipulation: 95, heartbreak: 25, rf: 800 },
          },
          {
            id: "c2",
            text: "Lui poser des questions précises sur certaines dates dans son message pour vérifier la cohérence",
            icon: "🔍",
            rfTag: "CONTRE-INTERROGATOIRE",
            consequence:
              "Il/elle réalise que tu te souviens de tout. Chaque message. Chaque date. Il/elle commence à transpirer.",
            stats: { chaos: 25, manipulation: 88, heartbreak: 30, rf: 850 },
          },
          {
            id: "c3",
            text: "Lui envoyer un voice message de 4 secondes de silence puis un 'OK'",
            icon: "🎙️",
            rfTag: "PERFORMANCE ART",
            consequence:
              "Le silence de 4 secondes hante sa journée entière. Il/elle réécoute 6 fois pour chercher un sous-texte.",
            stats: { chaos: 40, manipulation: 80, heartbreak: 20, rf: 900 },
          },
        ],
      },
      {
        id: "s3",
        title: "LE CAFÉ",
        situation:
          "Il/elle propose de 'prendre un café pour vraiment s'expliquer'. Tu acceptes. Tu arrives en avance. Tu es parfait(e). Tu le/la regardes entrer.",
        tone: "☕",
        choices: [
          {
            id: "c1",
            text: "Commencer la conversation sur un sujet complètement différent comme si l'explication n'était pas nécessaire",
            icon: "🌤️",
            rfTag: "RÉÉCRITURE",
            consequence:
              "Il/elle a préparé un discours depuis 3 jours. Tu parles de la météo. Son discours meurt dans sa gorge. Il/elle ne sait plus pourquoi vous êtes là.",
            stats: { chaos: 30, manipulation: 92, heartbreak: 15, rf: 950 },
          },
          {
            id: "c2",
            text: "Écouter tout, acquiescer, puis dire 'Je comprends' sans jamais dire que tu pardonnes",
            icon: "🧊",
            rfTag: "AMBIGUÏTÉ FROIDE",
            consequence:
              "Il/elle repart sans savoir où vous en êtes. Il/elle va analyser chaque micro-expression de ta face pendant une semaine.",
            stats: { chaos: 15, manipulation: 95, heartbreak: 30, rf: 1000 },
          },
          {
            id: "c3",
            text: "Lui montrer les 11 messages qu'il/elle t'avait envoyés à l'époque — que tu avais gardés",
            icon: "📁",
            rfTag: "ARCHIVE",
            consequence:
              "Tu les as gardés. Datés. Classés. Le fait que tu les aies conservés est plus éloquent que n'importe quelle réponse.",
            stats: { chaos: 45, manipulation: 75, heartbreak: 55, rf: 1050 },
          },
        ],
      },
      {
        id: "s4",
        title: "LA DÉCISION",
        situation:
          "Au moment de partir, il/elle te demande : 'Est-ce qu'on peut recommencer quelque chose ?'",
        tone: "🚩",
        choices: [
          {
            id: "c1",
            text: "'Je vais réfléchir.' — et ne plus jamais en reparler",
            icon: "🌀",
            rfTag: "BOUCLE INFINIE",
            consequence:
              "Tu l'as mis(e) dans le même enfer que celui qu'il/elle t'a fait vivre. La symétrie est parfaite.",
            stats: { chaos: 20, manipulation: 100, heartbreak: 40, rf: 1300 },
          },
          {
            id: "c2",
            text: "'Non.' — sans explication, sans colère, sans rien",
            icon: "🚪",
            rfTag: "CLÔTURE",
            consequence:
              "Le non le plus puissant de ta vie. Pas de drama. Pas de larmes. Just une porte qui se ferme proprement.",
            stats: { chaos: 10, manipulation: 70, heartbreak: 60, rf: 1100 },
          },
          {
            id: "c3",
            text: "Sourire, dire 'On verra', et recommencer à ghoster immédiatement",
            icon: "👻",
            rfTag: "POÉTIQUE",
            consequence:
              "Le cycle est complet. Tu es maintenant des deux côtés de l'histoire. C'est beau, d'une certaine façon.",
            stats: { chaos: 55, manipulation: 85, heartbreak: 30, rf: 1200 },
          },
        ],
      },
    ],
  },
  {
    id: "double-like-accidentel",
    title: "DOUBLE LIKE ACCIDENTEL",
    emoji: "❤️",
    tagline: "3h du matin. Une photo de 2019. Un like.",
    description:
      "Tu scrollais 'juste pour regarder'. Le pouce a glissé. La photo a 5 ans. Il/elle a vu.",
    difficulty: "DIGITAL CRISIS",
    difficultyColor: "#f43f5e",
    available: true,
    scenes: [
      {
        id: "s1",
        title: "L'INCIDENT",
        situation:
          "3h12 du matin. Tu scrollais le profil de ton ex 'juste pour voir'. Photo de 2019. Vacances. Il/elle sourit. Ton pouce glisse. Like. Tu retires le like immédiatement. Mais les notifications, elles, ne se retirent pas.",
        tone: "😱",
        choices: [
          {
            id: "c1",
            text: "Bloquer immédiatement puis débloquer 4 minutes après en espérant que ça efface tout",
            icon: "🚫",
            rfTag: "PANIQUE TOTALE",
            consequence:
              "Ça n'efface rien. Il/elle a reçu la notification de like, puis une de bloc, puis une de débloc. C'est pire qu'un aveu.",
            stats: { chaos: 60, manipulation: 20, heartbreak: 10, rf: 400 },
          },
          {
            id: "c2",
            text: "Ne rien faire et aller dormir comme si rien ne s'était passé",
            icon: "😴",
            rfTag: "DÉNI STRATÉGIQUE",
            consequence:
              "Il/elle a la notification. Toi, tu as une nuit de sommeil. La force mentale d'ignorer ce que tu as fait est déjà impressionnante.",
            stats: { chaos: 20, manipulation: 60, heartbreak: 15, rf: 500 },
          },
          {
            id: "c3",
            text: "Liker 12 autres photos immédiatement pour noyer le like original dans la masse",
            icon: "❤️❤️",
            rfTag: "NOYADE",
            consequence:
              "Tu passes de 'j'ai liké accidentellement une vieille photo' à 'je viens de liker tout son profil à 3h du matin'. Situation empirée.",
            stats: { chaos: 70, manipulation: 15, heartbreak: 20, rf: 350 },
          },
        ],
      },
      {
        id: "s2",
        title: "LE LENDEMAIN",
        situation:
          "9h23. Un message de ton ex : 'Salut. J'ai vu ta notif cette nuit 😅 Tout va bien ?'",
        tone: "📲",
        choices: [
          {
            id: "c1",
            text: "'Pardon j'étais dans mes photos de voyage et j'ai liké par erreur 😂'",
            icon: "🌍",
            rfTag: "ALIBI",
            consequence:
              "Il/elle sait que c'est faux. Toi tu sais que c'est faux. Vous faites semblant ensemble. C'est confortable.",
            stats: { chaos: 25, manipulation: 65, heartbreak: 10, rf: 450 },
          },
          {
            id: "c2",
            text: "Ne pas répondre de la journée puis répondre 'Ah oui désolé(e) le téléphone est bizarre parfois'",
            icon: "📱",
            rfTag: "TECHNIQUE DÉFAILLANTE",
            consequence:
              "Tu blâmes Apple pour tes émotions à 3h du matin. Respectueux.",
            stats: { chaos: 30, manipulation: 70, heartbreak: 15, rf: 500 },
          },
          {
            id: "c3",
            text: "'Je pensais à toi.' — juste ça, sans explication",
            icon: "💭",
            rfTag: "VÉRITÉ NUCLÉAIRE",
            consequence:
              "L'honnêteté comme bombe. Il/elle ne s'attendait pas à ça. Toi non plus, en vrai.",
            stats: { chaos: 40, manipulation: 30, heartbreak: 70, rf: 750 },
          },
        ],
      },
      {
        id: "s3",
        title: "LA CONVERSATION",
        situation:
          "Il/elle continue la conversation : 'Ça fait longtemps... tu fais quoi ces jours-ci ?' La porte est ouverte. Tu décides de ce qui entre.",
        tone: "💬",
        choices: [
          {
            id: "c1",
            text: "Répondre de façon enthousiaste sur ta vie — rien que des bonnes nouvelles",
            icon: "🌟",
            rfTag: "REVENGE LIFE",
            consequence:
              "Ta vie a l'air absolument parfaite. Chaque phrase est un couteau doux. Il/elle commence à regretter d'avoir posé la question.",
            stats: { chaos: 20, manipulation: 80, heartbreak: 25, rf: 700 },
          },
          {
            id: "c2",
            text: "Poser des questions sur sa vie à la place — ne rien révéler sur toi",
            icon: "🎤",
            rfTag: "INTERVIEW",
            consequence:
              "Tu sais tout de sa vie. Il/elle ne sait rien de la tienne. L'asymétrie d'information est un pouvoir.",
            stats: { chaos: 15, manipulation: 90, heartbreak: 20, rf: 800 },
          },
          {
            id: "c3",
            text: "Demander si vous pouvez 'continuer cette conversation autour d'un verre'",
            icon: "🥂",
            rfTag: "OFFENSIVE",
            consequence:
              "Tu transformes un like accidentel en rendez-vous. C'est soit du génie soit de la folie. Probablement les deux.",
            stats: { chaos: 50, manipulation: 55, heartbreak: 40, rf: 900 },
          },
        ],
      },
      {
        id: "s4",
        title: "LA VÉRITÉ",
        situation:
          "Au fil de la conversation, il/elle dit : 'Honnêtement, j'étais content(e) de voir ta notif. Ça m'a fait penser à avant.'",
        tone: "🚩",
        choices: [
          {
            id: "c1",
            text: "'Moi aussi.' — puis couper la conversation là, sur cette note parfaite",
            icon: "🎬",
            rfTag: "FADE TO BLACK",
            consequence:
              "Tu gardes le meilleur moment. La conversation finit en beauté, suspendue dans le temps. Tu ne replies plus. L'image reste parfaite.",
            stats: { chaos: 15, manipulation: 85, heartbreak: 50, rf: 1100 },
          },
          {
            id: "c2",
            text: "Ne pas répondre et attendre qu'il/elle envoie un deuxième message",
            icon: "⏳",
            rfTag: "PATIENCE ABSOLUE",
            consequence:
              "Il/elle envoie 'Tu es là ?' 47 minutes plus tard. Tu avais tout le pouvoir depuis le début.",
            stats: { chaos: 20, manipulation: 95, heartbreak: 30, rf: 1050 },
          },
          {
            id: "c3",
            text: "Lui dire que tu avais liké la photo exprès et que tu voulais juste voir sa réaction",
            icon: "😈",
            rfTag: "CONFESSION STRATÉGIQUE",
            consequence:
              "La vérité comme arme finale. Tu reprends le contrôle du récit. L'accident devient un plan. Rétroactivement.",
            stats: { chaos: 35, manipulation: 90, heartbreak: 45, rf: 1200 },
          },
        ],
      },
    ],
  },
];

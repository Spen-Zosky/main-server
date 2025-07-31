/**
 * Esempi di Brand Identity Systems
 * Template e ispirazioni per creare il tuo brand personalizzato
 */

import { designTokens } from '../tokens';

// Esempio 1: Brand E-commerce
export const ecommerceBrand = {
  values: {
    fiducia: 'Costruiamo relazioni durature con i clienti',
    convenienza: 'Prezzi giusti e trasparenti sempre',
    qualità: 'Solo prodotti selezionati e verificati',
    velocità: 'Consegne rapide e affidabili',
    innovazione: 'Sempre al passo con le nuove tendenze',
  },

  personality: {
    affidabile: 'Serio, trasparente, competente nel settore retail',
    dinamico: 'Veloce, efficiente, sempre aggiornato con le novità',
    accogliente: 'Friendly, disponibile, orientato al cliente',
    premuroso: 'Attento ai dettagli e alle esigenze individuali',
  },

  voice: {
    characteristics: [
      'Diretto e chiaro nelle comunicazioni',
      'Entusiasta dei prodotti che vendiamo',
      'Professionale ma amichevole nel supporto',
      'Onesto su prezzi, tempi e condizioni',
      'Proattivo nel risolvere problemi',
    ],
    avoid: [
      'Linguaggio troppo tecnico o settoriale',
      'Promesse irrealistiche su tempi o prezzi',
      'Tono aggressivo o pressante nelle vendite',
      'Gergo interno o abbreviazioni poco chiare',
    ],
  },

  visual: {
    logo: {
      primary: {
        symbol: '🛍️',
        description: 'Shopping bag rappresenta l\'esperienza di acquisto',
        usage: 'Logo principale per header, documenti ufficiali',
      },
    },

    colors: {
      primary: {
        color: '#E91E63', // Rosa shopping
        name: 'Shopping Pink',
        description: 'Rosa vibrante che trasmette energia e desiderio',
        usage: 'CTA, prezzi scontati, elementi di conversione',
      },
      secondary: {
        color: '#9C27B0', // Viola premium
        name: 'Premium Purple',
        description: 'Viola che comunica qualità e esclusività',
        usage: 'Prodotti premium, badge VIP, sezioni speciali',
      },
      accent: {
        color: '#FF5722', // Arancione urgenza
        name: 'Urgency Orange',
        description: 'Arancione per creare senso di urgenza',
        usage: 'Offerte limitate, countdown, notifiche importanti',
      },
    },

    typography: {
      primary: {
        family: 'Open Sans, Arial, sans-serif',
        description: 'Font pulito e leggibile per tutti i dispositivi',
        usage: 'Corpo testo, descrizioni prodotti, interfaccia',
      },
      secondary: {
        family: 'Montserrat, Helvetica, sans-serif',
        description: 'Font moderno per titoli e elementi di impatto',
        usage: 'Headings, nomi prodotti, call-to-action',
      },
    },
  },

  modules: {
    catalogo: {
      name: 'Catalogo Pro',
      fullName: 'Sistema di Catalogazione Avanzata',
      tagline: 'Trova tutto quello che cerchi, velocemente',
      description: 'Sistema intelligente per navigare e filtrare prodotti',
      personality: 'Organizzato, intuitivo, completo',
      imagery: 'Grids pulite, filtri visivi, preview accattivanti',
      applications: ['Ricerca prodotti', 'Filtri avanzati', 'Raccomandazioni', 'Wishlist'],
    },
    checkout: {
      name: 'Checkout Express',
      fullName: 'Sistema di Pagamento Veloce',
      tagline: 'Acquista in 3 click, massima sicurezza',
      description: 'Processo di acquisto ottimizzato per conversione massima',
      personality: 'Veloce, sicuro, trasparente',
      imagery: 'Progress indicators, icone sicurezza, design pulito',
      applications: ['Carrello', 'Pagamenti', 'Conferme ordine', 'Tracking'],
    },
  },
};

// Esempio 2: Brand Healthcare
export const healthcareBrand = {
  values: {
    cura: 'La salute del paziente è la nostra priorità assoluta',
    professionalità: 'Standard medici di eccellenza sempre',
    empatia: 'Comprendiamo e supportiamo ogni paziente',
    innovazione: 'Tecnologie avanzate al servizio della cura',
    accessibilità: 'Cure di qualità accessibili a tutti',
  },

  personality: {
    competente: 'Esperto, aggiornato, scientificamente rigoroso',
    rassicurante: 'Calmo, stabile, infonde fiducia e sicurezza',
    umano: 'Empatico, comprensivo, attento alla persona',
    innovativo: 'All\'avanguardia, tecnologicamente avanzato',
  },

  voice: {
    characteristics: [
      'Preciso e scientificamente accurato',
      'Rassicurante senza essere condiscendente',
      'Chiaro anche con termini medici complessi',
      'Empatico verso preoccupazioni e paure',
      'Proattivo nella prevenzione e educazione',
    ],
    avoid: [
      'Allarmismo o linguaggio che spaventa',
      'Termini medici senza spiegazioni',
      'Promesse di guarigione non realistiche',
      'Tono freddo o distaccato',
    ],
  },

  visual: {
    logo: {
      primary: {
        symbol: '🏥',
        description: 'Ospedale rappresenta cura e professionalità medica',
        usage: 'Identità principale per tutte le comunicazioni sanitarie',
      },
    },

    colors: {
      primary: {
        color: '#0277BD', // Blu medicina
        name: 'Medical Blue',
        description: 'Blu che trasmette fiducia, professionalità e calma',
        usage: 'Interfacce mediche, documentazione, headers',
      },
      secondary: {
        color: '#388E3C', // Verde salute
        name: 'Health Green',
        description: 'Verde natura che rappresenta salute e benessere',
        usage: 'Indicatori positivi, successi terapeutici, prevenzione',
      },
      accent: {
        color: '#F57C00', // Arancione energia
        name: 'Vitality Orange',
        description: 'Arancione che comunica energia e vitalità',
        usage: 'Call-to-action, appuntamenti, attività preventive',
      },
    },
  },

  modules: {
    cartella: {
      name: 'Cartella Digitale',
      tagline: 'La tua storia clinica sempre accessibile',
      personality: 'Sicura, completa, sempre aggiornata',
      applications: ['Storia clinica', 'Referti', 'Prescrizioni', 'Appuntamenti'],
    },
    telemedicina: {
      name: 'TeleCare',
      tagline: 'Cure specialistiche a distanza',
      personality: 'Innovativa, accessibile, professionale',
      applications: ['Consulti video', 'Monitoraggio remoto', 'Chat medica'],
    },
  },
};

// Esempio 3: Brand Education
export const educationBrand = {
  values: {
    crescita: 'Ogni studente può raggiungere il proprio potenziale',
    inclusività: 'Educazione di qualità per tutti, senza eccezioni',
    innovazione: 'Metodi didattici moderni ed efficaci',
    collaborazione: 'Apprendimento attraverso condivisione e teamwork',
    eccellenza: 'Standard educativi di livello internazionale',
  },

  personality: {
    ispirante: 'Motivante, entusiasta dell\'apprendimento',
    paziente: 'Comprensivo dei diversi ritmi di apprendimento',
    creativo: 'Innovativo nei metodi e negli approcci didattici',
    inclusivo: 'Accogliente verso tutte le diversità e background',
  },

  voice: {
    characteristics: [
      'Incoraggiante e positivo verso gli studenti',
      'Chiaro nelle spiegazioni e istruzioni',
      'Paziente con domande e difficoltà',
      'Entusiasta della materia insegnata',
      'Rispettoso delle diverse intelligenze e stili',
    ],
    avoid: [
      'Linguaggio che scoraggia o demotiva',
      'Confronti competitivi tra studenti',
      'Terminologia troppo accademica senza spiegazioni',
      'Tono autoritario o intimidatorio',
    ],
  },

  modules: {
    aula: {
      name: 'Aula Digitale',
      tagline: 'Apprendimento interattivo e coinvolgente',
      personality: 'Dinamica, interattiva, stimolante',
      applications: ['Lezioni online', 'Materiali didattici', 'Quiz interattivi'],
    },
    progresso: {
      name: 'Tracker Progresso',
      tagline: 'Monitora la tua crescita educativa',
      personality: 'Motivante, dettagliato, personalizzato',
      applications: ['Valutazioni', 'Obiettivi', 'Achievement', 'Portfolio'],
    },
  },
};

// Esempio 4: Brand Fintech
export const fintechBrand = {
  values: {
    trasparenza: 'Ogni operazione è chiara e comprensibile',
    sicurezza: 'Protezione massima dei dati e transazioni',
    innovazione: 'Tecnologie finanziarie all\'avanguardia',
    accessibilità: 'Servizi finanziari per tutti, ovunque',
    efficienza: 'Operazioni veloci e senza complicazioni',
  },

  personality: {
    affidabile: 'Solido, sicuro, trasparente nelle operazioni',
    innovativo: 'All\'avanguardia, tecnologicamente avanzato',
    accessibile: 'Semplice da usare, inclusivo',
    professionale: 'Competente, regolamentato, certificato',
  },

  visual: {
    colors: {
      primary: {
        color: '#1B5E20', // Verde fiducia
        name: 'Trust Green',
        description: 'Verde scuro che trasmette stabilità finanziaria',
        usage: 'Transazioni positive, saldi, investimenti',
      },
      secondary: {
        color: '#37474F', // Grigio professionale
        name: 'Professional Grey',
        description: 'Grigio elegante per serietà professionale',
        usage: 'Interfacce principali, testi, navigazione',
      },
      accent: {
        color: '#FFC107', // Oro valore
        name: 'Value Gold',
        description: 'Oro che rappresenta valore e opportunità',
        usage: 'Investimenti, rendimenti, offerte premium',
      },
    },
  },

  modules: {
    wallet: {
      name: 'Digital Wallet',
      tagline: 'I tuoi soldi sempre sotto controllo',
      personality: 'Sicuro, immediato, trasparente',
      applications: ['Saldo', 'Transazioni', 'Pagamenti', 'Storia'],
    },
    investimenti: {
      name: 'Smart Invest',
      tagline: 'Investi con intelligenza e sicurezza',
      personality: 'Professionale, analitico, educativo',
      applications: ['Portfolio', 'Analytics', 'Consigli', 'Mercati'],
    },
  },
};

// Utility per switching dinamico
export const getBrandByType = (type) => {
  const brands = {
    ecommerce: ecommerceBrand,
    healthcare: healthcareBrand,
    education: educationBrand,
    fintech: fintechBrand,
  };
  
  return brands[type] || ecommerceBrand;
};

export const availableBrandTypes = [
  { key: 'ecommerce', name: 'E-commerce', icon: '🛍️' },
  { key: 'healthcare', name: 'Healthcare', icon: '🏥' },
  { key: 'education', name: 'Education', icon: '🎓' },
  { key: 'fintech', name: 'Fintech', icon: '💰' },
];

export default {
  ecommerceBrand,
  healthcareBrand,
  educationBrand,
  fintechBrand,
  getBrandByType,
  availableBrandTypes,
};
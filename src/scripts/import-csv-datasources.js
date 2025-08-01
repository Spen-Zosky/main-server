/**
 * Import CSV Data Sources - Web-Hunter Framework
 * Imports ENTERPRISE-DATA-MINING-PROVIDERS-MATRIX-2025.csv into DataSourceCatalog
 * 
 * Transforms 666 enterprise data sources into Web-Hunter compatible format
 * with intelligent classification, geolocation, and metadata enrichment
 */
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const { DataSourceCatalog } = require('../models');

// Configuration
const CSV_FILE_PATH = '/home/ubuntu/main-server/docs/web-hunter-domain/ENTERPRISE-DATA-MINING-PROVIDERS-MATRIX-2025.csv';
const BATCH_SIZE = 50; // Process in batches for performance
const DRY_RUN = process.argv.includes('--dry-run');

/**
 * Context to classification type mapping
 */
const CONTEXT_TYPE_MAPPING = {
  'BIBLIOTECHE NAZIONALI': 'academic',
  'BIBLIOTECHE UNIVERSITARIE': 'academic', 
  'REPOSITORY ACCADEMICI': 'academic',
  'DATABASE COMMERCIALI': 'database',
  'PARLAMENTI E ISTITUZIONI': 'government',
  'ISTITUTI STATISTICI': 'government',
  'THINK TANKS': 'government',
  'UFFICI BREVETTI': 'government',
  'COMMISSIONI E AGENZIE': 'government',
  'ARCHIVI DIGITALI': 'file_repository',
  'ARCHIVI MUSICALI': 'file_repository',
  'ARCHIVI FOTOGRAFICI': 'file_repository',
  'ARCHIVI MULTIMEDIALI': 'file_repository',
  'MUSEI E ISTITUZIONI': 'academic',
  'CASE STUDIES': 'academic',
  'STARTUP E VENTURE': 'commercial',
  'ANNUAL REPORTS': 'commercial',
  'MEDICINA E SCIENZE': 'academic',
  'INGEGNERIA E TECNOLOGIA': 'academic',
  'SCIENZE FISICHE': 'academic',
  'SCIENZE SOCIALI': 'academic',
  'GEOSCIENZE': 'academic',
  'ASTRONOMIA': 'academic',
  'ARCHIVI STORICI': 'academic',
  'BLOG SCIENTIFICI': 'academic',
  'SOCIAL MEDIA': 'social_media'
};

/**
 * Access type mapping
 */
const ACCESS_TYPE_MAPPING = {
  'Gratuito': 'public',
  'Abbonamento': 'subscription_required',
  'Misto': 'registration_required',
  'Freemium': 'registration_required',
  'Commerciale': 'subscription_required',
  'Su richiesta': 'restricted',
  'Accademico': 'restricted',
  'Beta': 'restricted',
  'Richiesta': 'restricted'
};

/**
 * Country to region mapping
 */
const COUNTRY_REGION_MAPPING = {
  'Italia': 'Europe',
  'Germania': 'Europe',
  'Francia': 'Europe',
  'Regno Unito': 'Europe',
  'Spagna': 'Europe',
  'Paesi Bassi': 'Europe',
  'Svizzera': 'Europe',
  'Belgio': 'Europe',
  'Austria': 'Europe',
  'Norvegia': 'Europe',
  'Svezia': 'Europe',
  'Danimarca': 'Europe',
  'Finlandia': 'Europe',
  'Polonia': 'Europe',
  'Ungheria': 'Europe',
  'Repubblica Ceca': 'Europe',
  'Slovacchia': 'Europe',
  'Portogallo': 'Europe',
  'Russia': 'Europe',
  'USA': 'North America',
  'Canada': 'North America',
  'Giappone': 'Asia-Pacific',
  'Cina': 'Asia-Pacific',
  'Corea del Sud': 'Asia-Pacific',
  'Australia': 'Asia-Pacific',
  'Nuova Zelanda': 'Asia-Pacific',
  'Singapore': 'Asia-Pacific',
  'Hong Kong': 'Asia-Pacific',
  'India': 'Asia-Pacific',
  'Brasile': 'Latin America',
  'Argentina': 'Latin America',
  'Messico': 'Latin America',
  'Cile': 'Latin America',
  'America Latina': 'Latin America',
  'Sudafrica': 'Africa',
  'Egitto': 'Africa',
  'Marocco': 'Africa',
  'Nigeria': 'Africa',
  'Ghana': 'Africa',
  'Kenya': 'Africa',
  'Etiopia': 'Africa',
  'Arabia Saudita': 'Middle East',
  'Qatar': 'Middle East',
  'Israele': 'Middle East',
  'Iran': 'Middle East',
  'Turchia': 'Middle East',
  'Kuwait': 'Middle East',
  'Libano': 'Middle East',
  'Globale': 'Global',
  'Internazionale': 'Global',
  'Europa': 'Europe',
  'Americhe': 'Americas',
  'Asia': 'Asia-Pacific',
  'Africa': 'Africa',
  'Medio Oriente': 'Middle East',
  'CERN': 'Europe',
  'UE': 'Europe',
  'ONU': 'Global',
  'UNESCO': 'Global',
  'WIPO': 'Global',
  'Vaticano': 'Europe'
};

/**
 * Industry classification based on content
 */
const CONTENT_INDUSTRY_MAPPING = {
  'Fisica': ['technology', 'education'],
  'Matematica': ['technology', 'education'],
  'Computer Science': ['technology'],
  'CS': ['technology'],
  'Informatica': ['technology'],
  'Ingegneria': ['technology'],
  'Medicina': ['healthcare'],
  'Biologia': ['healthcare'],
  'Scienze Biomediche': ['healthcare'],
  'Economia': ['finance'],
  'Management': ['finance'],
  'Finance': ['finance'],
  'Diritto': ['legal'],
  'Legislazione': ['legal'],
  'Giurisprudenza': ['legal'],
  'Arte': ['media'],
  'Musica': ['media'],
  'Storia': ['education'],
  'Archeologia': ['education'],
  'Letteratura': ['education'],
  'Filosofia': ['education'],
  'Scienze Sociali': ['education'],
  'Politica': ['government'],
  'Relazioni Internazionali': ['government'],
  'Geopolitica': ['government'],
  'Startup': ['technology', 'finance'],
  'Venture Capital': ['finance'],
  'Brevetti': ['legal', 'technology'],
  'Commercio': ['retail'],
  'Automotive': ['automotive'],
  'Energia': ['energy'],
  'Telecomunicazioni': ['telecommunications'],
  'Real Estate': ['real_estate']
};

/**
 * Statistics tracking
 */
const stats = {
  total: 0,
  processed: 0,
  success: 0,
  errors: 0,
  skipped: 0,
  errorDetails: []
};

/**
 * Normalize and clean text
 */
function normalizeText(text) {
  if (!text || typeof text !== 'string') return '';
  return text.trim().replace(/\s+/g, ' ');
}

/**
 * Map context to classification type
 */
function mapContextToType(context) {
  const normalized = normalizeText(context).toUpperCase();
  
  for (const [key, value] of Object.entries(CONTEXT_TYPE_MAPPING)) {
    if (normalized.includes(key)) {
      return value;
    }
  }
  
  // Default classification
  return 'website';
}

/**
 * Map access to category and accessibility
 */
function mapAccessInfo(accesso, natura) {
  const accessType = normalizeText(accesso || '');
  const natureType = normalizeText(natura || '');
  
  // Determine accessibility
  let accessibility = 'public';
  for (const [key, value] of Object.entries(ACCESS_TYPE_MAPPING)) {
    if (accessType.includes(key)) {
      accessibility = value;
      break;
    }
  }
  
  // Determine category
  let category = 'public';
  if (natureType.includes('Privato') || accessType.includes('Commerciale')) {
    category = 'commercial';
  } else if (accessType.includes('Abbonamento') || accessType.includes('Premium')) {
    category = 'premium';
  } else if (natureType.includes('Pubblico') || natureType.includes('Governo')) {
    category = 'government';
  } else if (accessType.includes('Accademico') || accessType.includes('Università')) {
    category = 'academic';
  } else if (accessType.includes('Restricted') || accessType.includes('Su richiesta')) {
    category = 'restricted';
  }
  
  return { category, accessibility };
}

/**
 * Extract industries from content
 */
function extractIndustries(contenuti, organizzazione) {
  const industries = new Set(['general']); // Default industry
  const text = `${normalizeText(contenuti)} ${normalizeText(organizzazione)}`.toLowerCase();
  
  for (const [keyword, industryList] of Object.entries(CONTENT_INDUSTRY_MAPPING)) {
    if (text.includes(keyword.toLowerCase())) {
      industryList.forEach(industry => industries.add(industry));
    }
  }
  
  return Array.from(industries);
}

/**
 * Generate tags from row data
 */
function generateTags(row) {
  const tags = new Set();
  
  // Add context-based tags
  if (row.Contesto) {
    tags.add(normalizeText(row.Contesto).toLowerCase().replace(/\s+/g, '_'));
  }
  
  // Add country-based tags
  if (row.Paese) {
    tags.add(`country_${normalizeText(row.Paese).toLowerCase().replace(/\s+/g, '_')}`);
  }
  
  // Add content-based tags
  if (row.Contenuti) {
    const content = normalizeText(row.Contenuti).toLowerCase();
    ['multidisciplinare', 'ricerca', 'patrimonio', 'storia', 'scienze', 'arte', 'tecnologia']
      .forEach(keyword => {
        if (content.includes(keyword)) {
          tags.add(keyword);
        }
      });
  }
  
  // Add access-based tags
  if (row.Accesso) {
    const access = normalizeText(row.Accesso).toLowerCase();
    if (access.includes('gratuito')) tags.add('free_access');
    if (access.includes('abbonamento')) tags.add('subscription');
    if (access.includes('accademico')) tags.add('academic_access');
  }
  
  return Array.from(tags).slice(0, 10); // Limit to 10 tags
}

/**
 * Extract keywords from content
 */
function extractKeywords(contenuti) {
  if (!contenuti) return [];
  
  const keywords = new Set();
  const text = normalizeText(contenuti).toLowerCase();
  
  // Common academic and research keywords
  const commonKeywords = [
    'ricerca', 'research', 'università', 'university', 'biblioteca', 'library',
    'archivio', 'archive', 'museo', 'museum', 'patrimonio', 'heritage',
    'scienze', 'science', 'medicina', 'medicina', 'fisica', 'physics',
    'matematica', 'mathematics', 'storia', 'history', 'arte', 'art',
    'letteratura', 'literature', 'economia', 'economics', 'diritto', 'law',
    'tecnologia', 'technology', 'ingegneria', 'engineering'
  ];
  
  commonKeywords.forEach(keyword => {
    if (text.includes(keyword)) {
      keywords.add(keyword);
    }
  });
  
  // Extract specific subject terms
  const subjects = text.split(/[,;]/).map(s => s.trim()).filter(s => s.length > 3);
  subjects.slice(0, 5).forEach(subject => keywords.add(subject));
  
  return Array.from(keywords).slice(0, 15); // Limit to 15 keywords
}

/**
 * Transform CSV row to DataSourceCatalog format
 */
function transformRowToDataSource(row, index) {
  try {
    const sourceId = `SRC${String(index + 1).padStart(8, '0')}`;
    const accessInfo = mapAccessInfo(row.Accesso, row.Natura);
    const region = COUNTRY_REGION_MAPPING[normalizeText(row.Paese)] || 'Unknown';
    
    const dataSource = {
      sourceId,
      name: normalizeText(row.Nome) || `Source ${index + 1}`,
      displayName: normalizeText(row.Nome) || `Source ${index + 1}`,
      description: `${normalizeText(row.Contenuti || '')} - ${normalizeText(row['Istituzione/Azienda/Settore'] || '')}`.trim().replace(/^- |,$/, ''),
      
      classification: {
        type: mapContextToType(row.Contesto),
        category: accessInfo.category,
        industry: extractIndustries(row.Contenuti, row.Organizzazione),
        dataTypes: ['text', 'documents'], // Default for most academic sources
        accessibility: accessInfo.accessibility
      },
      
      technical: {
        primaryUrl: normalizeText(row.URL) || `https://example.com/source-${index + 1}`,
        alternativeUrls: [],
        protocol: normalizeText(row.URL || '').startsWith('https') ? 'https' : 'http',
        structure: {
          format: 'html',
          encoding: 'utf-8'
        },
        rateLimit: {
          requestsPerSecond: 1,
          requestsPerDay: 1000,
          burstLimit: 5
        }
      },
      
      content: {
        geographic: {
          country: normalizeText(row.Paese) || 'Unknown',
          region,
          coordinates: null // Could be enhanced with geocoding
        },
        
        languages: region === 'Europe' ? [
          { code: 'it', name: 'Italian', coverage: 80 },
          { code: 'en', name: 'English', coverage: 60 },
          { code: 'de', name: 'German', coverage: 40 },
          { code: 'fr', name: 'French', coverage: 40 }
        ] : [
          { code: 'en', name: 'English', coverage: 90 }
        ],
        
        topics: extractKeywords(row.Contenuti).map(keyword => ({
          name: keyword,
          category: 'general',
          confidence: 0.8,
          keywords: [keyword]
        })),
        
        updateFrequency: 'unknown',
        coverage: 'partial'
      },
      
      access: {
        authentication: {
          required: accessInfo.accessibility !== 'public',
          methods: accessInfo.accessibility === 'subscription_required' ? ['subscription'] : 
                   accessInfo.accessibility === 'api_key_required' ? ['api_key'] : 
                   accessInfo.accessibility === 'oauth_required' ? ['oauth'] : ['none']
        },
        
        pricing: {
          model: accessInfo.accessibility === 'public' ? 'free' : 
                 accessInfo.accessibility === 'subscription_required' ? 'subscription' : 'freemium',
          currency: region === 'Europe' ? 'EUR' : region === 'North America' ? 'USD' : 'USD'
        },
        
        limits: {
          daily: accessInfo.accessibility === 'public' ? 1000 : 10000,
          monthly: accessInfo.accessibility === 'public' ? 30000 : 300000
        }
      },
      
      quality: {
        score: {
          overall: 75, // Default quality score
          reliability: 80,
          completeness: 70,
          accuracy: 75,
          timeliness: 70
        },
        
        verified: false,
        lastAssessment: new Date()
      },
      
      providers: [], // To be populated with ProviderIntegration references
      
      usage: {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        lastAccessed: null,
        averageResponseTime: 0
      },
      
      status: {
        overall: 'active',
        lastChecked: new Date(),
        uptime: 95.0, // Default uptime
        issues: []
      },
      
      metadata: {
        tags: generateTags(row),
        keywords: extractKeywords(row.Contenuti),
        importSource: 'ENTERPRISE-DATA-MINING-PROVIDERS-MATRIX-2025',
        importDate: new Date(),
        originalData: {
          contesto: row.Contesto,
          telefono: normalizeText(row.Telefono),
          indirizzo: normalizeText(row['Indirizzo Completo']),
          organizzazione: normalizeText(row.Organizzazione),
          natura: normalizeText(row.Natura)
        }
      },
      
      // Schema required fields
      security: {
        owner: null, // To be set to admin user
        visibility: 'public',
        permissions: {
          read: ['admin', 'manager', 'analyst', 'user'],
          write: ['admin', 'manager'],
          delete: ['admin']
        }
      }
    };
    
    return dataSource;
    
  } catch (error) {
    throw new Error(`Error transforming row ${index + 1}: ${error.message}`);
  }
}

/**
 * Process CSV file and import data sources
 */
async function importDataSources() {
  console.log('🚀 Starting CSV Data Sources Import...');
  console.log(`📁 File: ${CSV_FILE_PATH}`);
  console.log(`🔧 Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE IMPORT'}`);
  
  if (!fs.existsSync(CSV_FILE_PATH)) {
    throw new Error(`CSV file not found: ${CSV_FILE_PATH}`);
  }
  
  // Connect to MongoDB if not dry run
  if (!DRY_RUN) {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/main_server_platform_test');
    console.log('✅ Connected to MongoDB');
  }
  
  const dataSources = [];
  let rowIndex = 0;
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(CSV_FILE_PATH)
      .pipe(csv({
        separator: ';', // CSV uses semicolon separator
        skipEmptyLines: true,
        headers: ['Contesto', 'Nome', 'URL', 'Paese', 'Indirizzo Completo', 'Telefono', 'Istituzione/Azienda/Settore', 'Organizzazione', 'Natura', 'Accesso', 'Contenuti']
      }))
      .on('data', (row) => {
        try {
          stats.total++;
          
          // Skip header row and empty rows
          if (rowIndex === 0 || !row.Nome || row.Nome.toLowerCase().includes('nome')) {
            rowIndex++;
            stats.skipped++;
            return;
          }
          
          const dataSource = transformRowToDataSource(row, rowIndex);
          dataSources.push(dataSource);
          
          stats.processed++;
          
          if (stats.processed <= 5) {
            console.log(`📝 Sample ${stats.processed}:`, {
              name: dataSource.name,
              type: dataSource.classification.type,
              category: dataSource.classification.category,
              country: dataSource.content.geographic.country,
              accessibility: dataSource.classification.accessibility
            });
          }
          
          rowIndex++;
        } catch (error) {
          stats.errors++;
          stats.errorDetails.push({
            row: rowIndex + 1,
            error: error.message,
            data: row
          });
          console.error(`❌ Error processing row ${rowIndex + 1}:`, error.message);
          rowIndex++;
        }
      })
      .on('end', async () => {
        try {
          console.log('\n📊 CSV Processing Complete:');
          console.log(`   Total rows: ${stats.total}`);
          console.log(`   Processed: ${stats.processed}`);
          console.log(`   Skipped: ${stats.skipped}`);
          console.log(`   Errors: ${stats.errors}`);
          
          if (stats.errors > 0) {
            console.log('\n❌ First 5 errors:');
            stats.errorDetails.slice(0, 5).forEach(err => {
              console.log(`   Row ${err.row}: ${err.error}`);
            });
          }
          
          if (DRY_RUN) {
            console.log('\n🔍 DRY RUN - No data imported');
            console.log(`   Would import ${dataSources.length} data sources`);
            resolve(stats);
            return;
          }
          
          // Import data sources in batches
          console.log(`\n💾 Importing ${dataSources.length} data sources to MongoDB...`);
          
          for (let i = 0; i < dataSources.length; i += BATCH_SIZE) {
            const batch = dataSources.slice(i, i + BATCH_SIZE);
            
            try {
              await DataSourceCatalog.insertMany(batch, { ordered: false });
              stats.success += batch.length;
              console.log(`   Imported batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(dataSources.length/BATCH_SIZE)} (${batch.length} sources)`);
            } catch (error) {
              console.error(`   Batch ${Math.floor(i/BATCH_SIZE) + 1} error:`, error.message);
              console.error(`   Error details:`, error);
              
              // Try to insert individually to identify problematic records  
              for (const source of batch) {
                try {
                  const result = await DataSourceCatalog.create(source);
                  console.log(`     ✅ Inserted: ${source.sourceId}`);
                  stats.success++;
                } catch (individualError) {
                  console.error(`     ❌ Failed ${source.sourceId}:`, individualError.message);
                  stats.errors++;
                  stats.errorDetails.push({
                    sourceId: source.sourceId,
                    error: individualError.message,
                    validationErrors: individualError.errors || null
                  });
                }
              }
            }
          }
          
          console.log('\n🎉 Import Complete!');
          console.log(`   Successfully imported: ${stats.success}`);
          console.log(`   Failed: ${stats.errors}`);
          
          if (!DRY_RUN) {
            await mongoose.disconnect();
            console.log('✅ Disconnected from MongoDB');
          }
          
          resolve(stats);
          
        } catch (error) {
          reject(error);
        }
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

/**
 * Main execution
 */
if (require.main === module) {
  importDataSources()
    .then((result) => {
      console.log('\n✅ Import completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Import failed:', error.message);
      process.exit(1);
    });
}

module.exports = {
  importDataSources,
  transformRowToDataSource,
  CONTEXT_TYPE_MAPPING,
  ACCESS_TYPE_MAPPING,
  COUNTRY_REGION_MAPPING
};
/**
 * Design System History Manager
 * Sistema di gestione cronologica e versioning delle raccolte GUI
 */

import { format } from 'date-fns';
import { createHash } from 'crypto';

export class HistoryManager {
  constructor() {
    this.historyLog = new Map();
    this.changesets = new Map();
    this.snapshots = new Map();
    this.branches = new Map(); // Per future feature branches del design system
  }

  /**
   * Registra una configurazione come Attiva/Default
   * @param {string} collectionId - ID della raccolta
   * @param {object} configData - Dati della configurazione
   */
  registerActiveDefault(collectionId, configData) {
    const entry = {
      id: this.generateId(),
      collectionId,
      timestamp: new Date(),
      type: 'ACTIVE_DEFAULT_SET',
      status: 'active|default',
      description: 'Configurazione impostata come Attiva e Default',
      changes: {
        from: 'previous_config',
        to: 'modern_enterprise_active',
        impact: 'HIGH'
      },
      metadata: {
        version: configData.version || '2.0.0',
        author: 'System',
        environment: 'production',
        backup: configData.backup || null
      },
      features: configData.features || [],
      hash: this.generateHash(JSON.stringify(configData))
    };

    this.addToHistory(collectionId, entry);
    this.createSnapshot(collectionId, `active-default-${format(new Date(), 'yyyyMMdd-HHmmss')}`, configData);
    
    return entry;
  }

  /**
   * Inizializza il tracking della cronologia per una raccolta
   * @param {string} collectionId - ID della raccolta
   * @param {object} initialData - Dati iniziali della raccolta
   */
  initializeHistory(collectionId, initialData) {
    const historyEntry = {
      collectionId,
      createdAt: new Date(),
      entries: [],
      branches: ['main'], // Branch principale
      currentBranch: 'main',
      tags: [],
      metadata: {
        totalChanges: 0,
        lastMajorUpdate: new Date(),
        lastMinorUpdate: new Date(),
        lastPatchUpdate: new Date()
      }
    };

    // Crea il primo entry della cronologia
    const initialEntry = this.createHistoryEntry(
      collectionId,
      'collection.created',
      'Initial collection creation',
      null,
      initialData,
      '1.0.0'
    );

    historyEntry.entries.push(initialEntry);
    this.historyLog.set(collectionId, historyEntry);

    // Crea il primo snapshot
    this.createSnapshot(collectionId, initialData, 'Initial baseline snapshot');

    return historyEntry;
  }

  /**
   * Registra un cambiamento nella raccolta
   * @param {string} collectionId - ID della raccolta
   * @param {string} changeType - Tipo di cambiamento
   * @param {string} description - Descrizione del cambiamento
   * @param {object} oldValue - Valore precedente
   * @param {object} newValue - Nuovo valore
   * @param {string} version - Versione dopo il cambiamento
   * @param {object} metadata - Metadati aggiuntivi
   */
  recordChange(collectionId, changeType, description, oldValue, newValue, version, metadata = {}) {
    const history = this.historyLog.get(collectionId);
    if (!history) {
      throw new Error(`Cronologia non inizializzata per raccolta ${collectionId}`);
    }

    // Crea entry cronologia
    const entry = this.createHistoryEntry(
      collectionId,
      changeType,
      description,
      oldValue,
      newValue,
      version,
      metadata
    );

    history.entries.push(entry);
    history.metadata.totalChanges++;

    // Aggiorna timestamp basato sul tipo di versione
    this.updateVersionTimestamps(history, version);

    // Crea changeset se richiesto
    if (metadata.createChangeset) {
      this.createChangeset(collectionId, entry, metadata.changesetName);
    }

    // Auto-snapshot per cambiamenti maggiori
    if (this.isMajorChange(changeType)) {
      this.createSnapshot(collectionId, newValue, `Auto-snapshot: ${description}`);
    }

    this.historyLog.set(collectionId, history);
    return entry;
  }

  /**
   * Crea un entry della cronologia
   */
  createHistoryEntry(collectionId, changeType, description, oldValue, newValue, version, metadata = {}) {
    const entryId = this.generateEntryId();
    const timestamp = new Date();

    return {
      id: entryId,
      collectionId,
      timestamp,
      changeType,
      description,
      version,
      oldValue: oldValue ? this.sanitizeValue(oldValue) : null,
      newValue: newValue ? this.sanitizeValue(newValue) : null,
      diff: this.calculateDiff(oldValue, newValue),
      hash: this.calculateHash(newValue),
      author: metadata.author || 'system',
      branch: metadata.branch || 'main',
      tags: metadata.tags || [],
      metadata: {
        ...metadata,
        changeSize: this.calculateChangeSize(oldValue, newValue),
        impactLevel: this.calculateImpactLevel(changeType),
        automated: metadata.automated || false
      }
    };
  }

  /**
   * Crea uno snapshot completo della raccolta
   * @param {string} collectionId - ID della raccolta
   * @param {object} data - Dati completi della raccolta
   * @param {string} description - Descrizione dello snapshot
   * @param {object} metadata - Metadati aggiuntivi
   */
  createSnapshot(collectionId, data, description, metadata = {}) {
    const snapshotId = this.generateSnapshotId();
    const timestamp = new Date();

    const snapshot = {
      id: snapshotId,
      collectionId,
      timestamp,
      description,
      data: JSON.parse(JSON.stringify(data)), // Deep clone
      hash: this.calculateHash(data),
      size: JSON.stringify(data).length,
      metadata: {
        ...metadata,
        version: data.version || 'unknown',
        branch: metadata.branch || 'main',
        automatic: metadata.automatic || false
      }
    };

    // Mantieni solo gli ultimi 50 snapshot per collezione
    const existing = Array.from(this.snapshots.values())
      .filter(s => s.collectionId === collectionId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    if (existing.length >= 50) {
      // Rimuovi i più vecchi
      existing.slice(49).forEach(old => {
        this.snapshots.delete(old.id);
      });
    }

    this.snapshots.set(snapshotId, snapshot);
    return snapshot;
  }

  /**
   * Crea un changeset per raggruppare modifiche correlate
   * @param {string} collectionId - ID della raccolta
   * @param {object} entry - Entry della cronologia
   * @param {string} changesetName - Nome del changeset
   */
  createChangeset(collectionId, entry, changesetName) {
    const changesetId = this.generateChangesetId();
    const timestamp = new Date();

    let changeset = Array.from(this.changesets.values())
      .find(cs => cs.collectionId === collectionId && cs.name === changesetName && cs.status === 'open');

    if (!changeset) {
      changeset = {
        id: changesetId,
        collectionId,
        name: changesetName,
        status: 'open', // open, closed, merged
        createdAt: timestamp,
        updatedAt: timestamp,
        entries: [],
        metadata: {
          author: entry.author,
          branch: entry.branch,
          totalChanges: 0
        }
      };
      this.changesets.set(changesetId, changeset);
    }

    changeset.entries.push(entry.id);
    changeset.updatedAt = timestamp;
    changeset.metadata.totalChanges++;

    return changeset;
  }

  /**
   * Ottiene la cronologia completa di una raccolta
   * @param {string} collectionId - ID della raccolta
   * @param {object} options - Opzioni di filtro
   */
  getHistory(collectionId, options = {}) {
    const history = this.historyLog.get(collectionId);
    if (!history) return null;

    let entries = [...history.entries];

    // Filtri
    if (options.since) {
      entries = entries.filter(e => new Date(e.timestamp) >= new Date(options.since));
    }

    if (options.until) {
      entries = entries.filter(e => new Date(e.timestamp) <= new Date(options.until));
    }

    if (options.changeType) {
      entries = entries.filter(e => e.changeType === options.changeType);
    }

    if (options.author) {
      entries = entries.filter(e => e.author === options.author);
    }

    if (options.branch) {
      entries = entries.filter(e => e.branch === options.branch);
    }

    // Ordinamento
    entries.sort((a, b) => {
      if (options.order === 'asc') {
        return new Date(a.timestamp) - new Date(b.timestamp);
      }
      return new Date(b.timestamp) - new Date(a.timestamp);
    });

    // Limit
    if (options.limit) {
      entries = entries.slice(0, options.limit);
    }

    return {
      ...history,
      entries,
      filtered: entries.length !== history.entries.length
    };
  }

  /**
   * Ottiene tutti gli snapshots di una raccolta
   * @param {string} collectionId - ID della raccolta
   */
  getSnapshots(collectionId) {
    return Array.from(this.snapshots.values())
      .filter(s => s.collectionId === collectionId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  /**
   * Ripristina una raccolta da uno snapshot
   * @param {string} collectionId - ID della raccolta
   * @param {string} snapshotId - ID dello snapshot
   */
  restoreFromSnapshot(collectionId, snapshotId) {
    const snapshot = this.snapshots.get(snapshotId);
    if (!snapshot || snapshot.collectionId !== collectionId) {
      throw new Error(`Snapshot ${snapshotId} non trovato per raccolta ${collectionId}`);
    }

    // Registra il restore come cambiamento
    this.recordChange(
      collectionId,
      'collection.restored',
      `Restored from snapshot: ${snapshot.description}`,
      null,
      snapshot.data,
      snapshot.metadata.version,
      {
        snapshotId,
        restoredAt: new Date(),
        automated: false
      }
    );

    return snapshot.data;
  }

  /**
   * Confronta due versioni di una raccolta
   * @param {string} collectionId - ID della raccolta
   * @param {string} version1 - Prima versione
   * @param {string} version2 - Seconda versione
   */
  compareVersions(collectionId, version1, version2) {
    const history = this.historyLog.get(collectionId);
    if (!history) throw new Error(`Cronologia non trovata per ${collectionId}`);

    const entry1 = history.entries.find(e => e.version === version1);
    const entry2 = history.entries.find(e => e.version === version2);

    if (!entry1 || !entry2) {
      throw new Error('Una o entrambe le versioni non sono state trovate');
    }

    return {
      version1: {
        version: entry1.version,
        timestamp: entry1.timestamp,
        data: entry1.newValue
      },
      version2: {
        version: entry2.version,
        timestamp: entry2.timestamp,
        data: entry2.newValue
      },
      diff: this.calculateDiff(entry1.newValue, entry2.newValue),
      changesSummary: this.summarizeChanges(entry1, entry2)
    };
  }

  /**
   * Genera report cronologia
   * @param {string} collectionId - ID della raccolta
   * @param {object} options - Opzioni del report
   */
  generateHistoryReport(collectionId, options = {}) {
    const history = this.getHistory(collectionId, options);
    if (!history) throw new Error(`Cronologia non trovata per ${collectionId}`);

    const report = {
      collectionId,
      reportGeneratedAt: new Date(),
      period: {
        from: options.since || history.entries[history.entries.length - 1]?.timestamp,
        to: options.until || history.entries[0]?.timestamp
      },
      summary: {
        totalChanges: history.entries.length,
        changeTypes: this.groupByChangeType(history.entries),
        authors: this.groupByAuthor(history.entries),
        impactLevels: this.groupByImpactLevel(history.entries),
        versionsInPeriod: this.getVersionsInPeriod(history.entries)
      },
      timeline: this.createTimeline(history.entries),
      snapshots: this.getSnapshots(collectionId).length,
      changesets: Array.from(this.changesets.values())
        .filter(cs => cs.collectionId === collectionId).length,
      metadata: history.metadata
    };

    return report;
  }

  /**
   * Esporta cronologia in formato JSON
   * @param {string} collectionId - ID della raccolta
   * @param {string} format - Formato di esportazione
   */
  exportHistory(collectionId, format = 'json') {
    const history = this.getHistory(collectionId);
    const snapshots = this.getSnapshots(collectionId);
    const changesets = Array.from(this.changesets.values())
      .filter(cs => cs.collectionId === collectionId);

    const exportData = {
      collectionId,
      exportedAt: new Date(),
      format: `history-export-v1.0-${format}`,
      history,
      snapshots,
      changesets,
      metadata: {
        totalEntries: history.entries.length,
        totalSnapshots: snapshots.length,
        totalChangesets: changesets.length,
        dateRange: {
          from: history.entries[history.entries.length - 1]?.timestamp,
          to: history.entries[0]?.timestamp
        }
      }
    };

    if (format === 'json') {
      return JSON.stringify(exportData, null, 2);
    }

    // Future: altri formati (CSV, XML, etc.)
    throw new Error(`Formato ${format} non supportato`);
  }

  /**
   * Utility methods
   */
  sanitizeValue(value) {
    if (typeof value === 'object' && value !== null) {
      // Rimuovi dati sensibili o troppo grandi
      const sanitized = JSON.parse(JSON.stringify(value));
      return sanitized;
    }
    return value;
  }

  calculateHash(data) {
    return createHash('md5').update(JSON.stringify(data)).digest('hex');
  }

  calculateDiff(oldValue, newValue) {
    // Implementazione semplificata del diff
    if (!oldValue && newValue) return { type: 'added', changes: newValue };
    if (oldValue && !newValue) return { type: 'removed', changes: oldValue };
    if (!oldValue && !newValue) return { type: 'none', changes: null };

    // Per ora un diff semplice, in futuro si potrebbe usare una libreria dedicata
    return {
      type: 'modified',
      changes: {
        before: this.sanitizeValue(oldValue),
        after: this.sanitizeValue(newValue)
      }
    };
  }

  calculateChangeSize(oldValue, newValue) {
    const oldSize = oldValue ? JSON.stringify(oldValue).length : 0;
    const newSize = newValue ? JSON.stringify(newValue).length : 0;
    return Math.abs(newSize - oldSize);
  }

  calculateImpactLevel(changeType) {
    const impactMap = {
      'collection.created': 'high',
      'collection.restored': 'high',
      'theme.changed': 'high',
      'colors.updated': 'medium',
      'components.added': 'medium',
      'components.modified': 'low',
      'icons.added': 'low',
      'animations.added': 'low',
      'typography.updated': 'medium',
      'accessibility.improved': 'medium',
      'performance.optimized': 'low',
      'technical.updated': 'low'
    };

    return impactMap[changeType] || 'unknown';
  }

  isMajorChange(changeType) {
    const majorChanges = [
      'collection.created',
      'collection.restored', 
      'theme.changed',
      'colors.major_update',
      'components.breaking_change',
      'architecture.changed'
    ];
    return majorChanges.includes(changeType);
  }

  updateVersionTimestamps(history, version) {
    const [major, minor, patch] = version.split('.').map(Number);
    const now = new Date();

    // Controlla l'ultima versione per determinare il tipo di update
    const lastEntry = history.entries[history.entries.length - 2]; // Penultimo entry
    if (lastEntry) {
      const [lastMajor, lastMinor, lastPatch] = lastEntry.version.split('.').map(Number);
      
      if (major > lastMajor) {
        history.metadata.lastMajorUpdate = now;
      } else if (minor > lastMinor) {
        history.metadata.lastMinorUpdate = now;
      } else if (patch > lastPatch) {
        history.metadata.lastPatchUpdate = now;
      }
    }
  }

  groupByChangeType(entries) {
    return entries.reduce((acc, entry) => {
      acc[entry.changeType] = (acc[entry.changeType] || 0) + 1;
      return acc;
    }, {});
  }

  groupByAuthor(entries) {
    return entries.reduce((acc, entry) => {
      acc[entry.author] = (acc[entry.author] || 0) + 1;
      return acc;
    }, {});
  }

  groupByImpactLevel(entries) {
    return entries.reduce((acc, entry) => {
      const level = entry.metadata.impactLevel;
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {});
  }

  getVersionsInPeriod(entries) {
    return [...new Set(entries.map(e => e.version))];
  }

  createTimeline(entries) {
    return entries.map(entry => ({
      timestamp: entry.timestamp,
      version: entry.version,
      changeType: entry.changeType,
      description: entry.description,
      impactLevel: entry.metadata.impactLevel,
      author: entry.author
    }));
  }

  generateEntryId() {
    return `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  generateSnapshotId() {
    return `snap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  generateChangesetId() {
    return `cs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  summarizeChanges(entry1, entry2) {
    // Implementazione semplificata del summary
    return {
      timespan: Math.abs(new Date(entry2.timestamp) - new Date(entry1.timestamp)),
      versionJump: entry2.version !== entry1.version,
      changeTypes: [entry1.changeType, entry2.changeType],
      impact: [entry1.metadata.impactLevel, entry2.metadata.impactLevel]
    };
  }
}

export default HistoryManager;